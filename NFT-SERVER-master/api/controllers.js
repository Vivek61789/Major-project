const organizerModel = require("../api/organizerSchema")
const loginModel = require('../api/loginSchema')
const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");
const jwt = require("jsonwebtoken");
const config = require('../env.json');
const count_schema = require('../api/EventCountSchema')

const saveEventByOrg = require('../api/eventByOrgSchema')





//API to verify and decode provided JWT token in requests
const verifyToken = (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.secret);
    console.log("verified jwt token ", decoded)
    return decoded;
  } catch (err) {
    console.log("Error in jwt verification", err)
    return res.status(401).send("A valid token is required for authentication");
  }
};

//internal function to generate randon alphanumeric string for verification
function getRandomString(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

//This api generates the nonce which is needed to be signed by the organizer
exports.generateNonce = async function (req, res) {
  let address = req.body.address;
  let nonce = getRandomString(6);

  if (!address) {
    console.log("Please provide valid inputs")
    return res.status(400).json({
      success: false,
      message: "Request cannot be processed.Please provide valid inputs",
    });
  }
  try {
    loginModel
      .find({
        $or: [
          {
            address: {
              $regex: address,
              $options: "i",
            },
          },
        ],
      })
      .exec()
      .then(async (user, err) => {
        console.log("user---", user);
        if (err) {
          console.log("Error in nonce generation----", err);
          return res.status(400).json({
            success: false,
            message:
              "Error in generating nonce.Please try again and ensure address is not already registered",
          });
        } else {
          if (
            user[0] &&
            user[0].address.toLowerCase() != address.toLowerCase()
          ) {
            return res.status(400).json({
              success: false,
              message:
                "Error in generating nonce.Please try again and ensure address is registered",
            });
          }
          // update the nonce here in db and retrun
          let userAddress = user.length != 0 ? user[0].address : address;
          console.log(userAddress)
          const query = {
            address: userAddress,
          };
          const update = {
            $set: {
              nonce: nonce,
            },
          };
          const options = {
            upsert: true,
          };
          console.log(query);
          console.log(update);
          loginModel.updateOne(query, update, options, function (err, doc) {
            console.log("line--151", doc, err);
            if (err) {
              console.log("Error in nonce generation---- here2", err);
              return res.status(400).json({
                success: false,
                message:
                  "Error in generating nonce.Please try again and ensure address is not already registered",
              });
            } else {
              return res.status(200).json({
                success: true,
                message: nonce,
              });
            }
          });
        }
      });
  } catch (error) {
    console.log("Error in Sending Mail ", error);
    return res.status(400).json({
      success: false,
      message: "Error in Sending Mail",
    });
  }
};

//API to authenticate user metamask signature for JWT token generation
exports.authenticate = function (req, res) {
  let address = req.body.address;
  let signature = req.body.signature;
  if (!address || !signature) {
    console.log("Please provide valid inputs");
    return res.status(400).json({
      success: false,
      message: "Request cannot be processed.Please provide valid inputs",
    });
  }
  loginModel
    .find({
      address: {
        $regex: address,
        $options: "i",
      },
    })
    .exec()
    .then(async (user, err) => {
      if (user.length != 0) {
        if (!user[0].nonce) {
          return res.status(200).json({
            success: true,
            isAuthenticated: false,
            message: "Please generate new nonce first to proceed",
          });
        }
        const msg = `I am signing my one-time nonce: ${user[0].nonce}`;

        const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
        const addressSign = recoverPersonalSignature({
          data: msgBufferHex,
          sig: signature,
        });
        if (addressSign.toLowerCase() === address.toLowerCase()) {
          var tokenData = {
            payload: {
              address: user[0].address,
            },
          };
          const token = jwt.sign(tokenData, config.secret, {
            expiresIn: "2h",
          });
          loginModel.findOneAndUpdate(
            {
              address: {
                $regex: address,
                $options: "i",
              },
            },
            { $set: { nonce: "" } },
            {
              upsert: false,
              new: true,
            },
            function (err, doc) {
              if (err) {
                console.log("Error updating nonce & token" + err);
                return res.status(400).json({
                  success: false,
                  message: "Error in Authentication",
                });
              } else {
                return res.status(200).json({
                  success: true,
                  isAuthenticated: true,
                  token: token,
                });
              }
            }
          );
        } else {
          console.log("Error in authentication");
          return res.status(400).json({
            success: false,
            message: "Error in authentication",
          });
        }
      } else {
        if (user.length == 0) {
          return res.status(200).json({
            success: true,
            message: "user with this address does not exist",
          });
        } else {
          console.log("Error in getting auth details" + err);
          return res.status(400).json({
            success: false,
            message: "Error in getting auth details",
          });
        }
      }
    })
    .catch((err) => {
      console.log("Error getting auth details --" + err);
      return res.status(400).json({
        success: false,
        message: "Error Getting Auth Details",
      });
    });
};

//API to signup/onBoard the organizer 
exports.saveOrganizerDetails = function (req, res) {
  console.log('test');
  var result1 = verifyToken(req, res);
  let address = result1.payload.address;
  let email = req.body.email;
  let organizer_Name = req.body.organizer_name;
  let organization_name = req.body.organization_name;

  if (!address || !email || !organizer_Name || !organization_name) {
    console.log("Please provide valid inputs")
    return res.status(400).json({
      success: false,
      message: "Request cannot be processed.Please provide valid inputs",
    });
  }
  try {
    organizerModel.findOneAndUpdate(
      { address: address },
      { $set: { email: email, organizer_Name: organizer_Name, organization_name: organization_name } },
      {
        upsert: true,
        new: true,
      },
      function (err, doc) {
        if (err) {
          console.log("Error in auth generation----" + err);
          return res.status(400).json({
            success: false,
            message: "Error in generating auth token.Please try again",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Stored values in db",
          });
          console.log("Stored values")
        }
      }
    )
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error: " + error,
    });
  }
}

//This api provides the page to which origanizer needs to be reouted to after -
//-clicking on create an event button from UI 
exports.reroute = function (req, res) {
  var result1 = verifyToken(req, res);
  let address = result1.payload.address;
  let result = "";
  if (!address) {
    console.log("Please provide valid inputs")
    return res.status(400).json({
      success: false,
      message: "Request cannot be processed.Please provide valid inputs",
    })
  }
  try {
    organizerModel.findOne({
      address: {
        $regex: address,
        $options: "i",
      },
    },
      async function (err, doc) {
        if (err) {
          console.log("Error ----" + err);
          return res.status(400).json({
            success: false,
            message: "Error: " + err,
          });
        }
        else if (!doc) {
          result = "register";
          return res.status(200).json({
            success: true,
            result: result,
            message: "Ask the organizer to signup",
          });
        }
        else {
          result = "registered";
          return res.status(200).json({
            success: true,
            result: result,
            message: "Reroute the organizer directly to create event page",
          });
        }
      }
    )
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error: " + error,
    });
  }
}


exports.saveEventByOrganizer = async function (req, res) {
  console.log('saveEventByOrganizer');
  // var result1 = verifyToken(req, res);
  let organizer = req.body.organizer;
  let eventName = req.body.eventName;
  let eventSymbol = req.body.eventSymbol;
  let date = req.body.date;
  let price = req.body.price;
  let ticketSupply = req.body.ticketSupply;
  let event_count = req.body.event_count;
  let contract_address = req.body.contract_address


  if (!organizer || !eventName || !eventSymbol || !date || !price || !ticketSupply || !event_count || !contract_address) {
    console.log("Please provide valid inputs")
    return res.status(400).json({
      success: false,
      message: "Request cannot be processed.Please provide valid inputs",
    });
  }
  try {
    const d = {
      organizer,
      eventName,
      eventSymbol,
      date,
      price,
      ticketSupply,
      event_count,
      contract_address
    }
    const saveData = new saveEventByOrg(d)
    await saveData.save()
    return res.status(200).json({
      success: true,
      message: "Event Added Successfully.",
      data: saveData,
      error: null
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error: " + error,
    });
  }
}



exports.getEventByOrganizer = async function (req, res) {
  const address = req.body.address
  const findAddress = await saveEventByOrg.find({ organizer: address })
  if (findAddress?.length === 0) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: "NO EVENTS",
      data: [],
      error: null,
      resource: req.originalUrl,
    });
  }
  if (findAddress?.length > 0) {
    return res.status(200).json({
      success: true,
      code: 200,
      message: "data fetched",
      data: findAddress,
      error: null,
      resource: req.originalUrl,
    });
  }
}


exports.updateEventByOrganizer = async function (req, res) {
  console.log('updated',req.body);
  
  try {
    const eventId = req.body.id;
    const updatedData = {
      eventName: req.body.eventName,
      eventSymbol: req.body.eventSymbol,
      date: req.body.date,
      price: req.body.price,
      ticketSupply: req.body.ticketSupply,
    };

    const updatedEvent = await saveEventByOrg.findOneAndUpdate({ _id: eventId }, updatedData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      success: true,
      code: 200,
      message: "data updated",
      data: updatedEvent,
      error: null,
      resource: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error: " + error,
    });
  }
}



