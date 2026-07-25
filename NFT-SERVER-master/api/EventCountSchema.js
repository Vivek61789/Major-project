const mongoose = require("mongoose");

const count_schema = new mongoose.Schema({
  present_count: {
    type: Number,
  },
  total_count: {
    type: Number,
  },
});

module.exports = mongoose.model("count_schema", count_schema);
