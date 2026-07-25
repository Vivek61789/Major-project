const mongoose = require('mongoose');

const login = new mongoose.Schema( {
    address: {
        type: String,
        required: true,
        //unique: true // `email` must be unique
      },
    nonce: String,
    token: String
});

module.exports = mongoose.model('login_db',login)