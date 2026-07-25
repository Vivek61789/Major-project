const mongoose = require('mongoose');

const eventOrgSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventSymbol: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    ticketSupply: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    event_count:{
        type:Number,
        required:true
    },
    contract_address:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('eventOrgSchema', eventOrgSchema)