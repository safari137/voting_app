var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
   name: String,
   password: String,
   email: String,
   polls: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll"
       }
   ]
});

module.exports = mongoose.model("User", userSchema);