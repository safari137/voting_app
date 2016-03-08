var mongoose    = require('mongoose');

var pollSchema = mongoose.Schema({
    title: String,
    options: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Option"
        }
    ]
});

module.exports = mongoose.model("Poll", pollSchema);