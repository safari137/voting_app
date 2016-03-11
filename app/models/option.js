var mongoose = require('mongoose');

var optionSchema = mongoose.Schema({
    name: String,
    votes: Number
});

module.exports = mongoose.model("Option", optionSchema);