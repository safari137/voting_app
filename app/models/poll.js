var mongoose    = require('mongoose');

var pollSchema = mongoose.Schema({
    title: String,
    owner: mongoose.Schema.Types.ObjectId,
    voters: [
        {
            id: mongoose.Schema.Types.ObjectId
        }
    ],
    options: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Option"
        }
    ]
});

module.exports = mongoose.model("Poll", pollSchema);