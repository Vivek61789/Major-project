"use strict";

module.exports = function (app) {
  let eventTicketController = require("../api/controllers");

  app
    .route("/api/v1/saveOrganizerDetails")
    .post(eventTicketController.saveOrganizerDetails);

  app.route("/api/v1/generateNonce").post(eventTicketController.generateNonce);

  app.route("/api/v1/authenticate").post(eventTicketController.authenticate);

  app.route("/api/v1/reroute").post(eventTicketController.reroute);
  app.route("/api/v1/saveEventDetailsByOrganizer").post(eventTicketController.saveEventByOrganizer);
  app.route("/api/v1/getEventDetailsByOrganizer").post(eventTicketController.getEventByOrganizer);
  app.route("/api/v1/updateEventByOrganizer").put(eventTicketController.updateEventByOrganizer);
};
