const mongoose = require('mongoose');

const Organizer = new mongoose.Schema( {
    address: {
        type: String,
        required: true,
        unique: true // `email` must be unique
      },
    email : String,
    organizer_Name : String,
    organisation_Name : String
});

module.exports = mongoose.model('organizer_db',Organizer)