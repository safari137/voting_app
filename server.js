var express     = require("express"),
    mongoose    = require("mongoose"),
    app         = express(),
    seedDB      = require('./seedDB');
    
mongoose.connect("mongodb://localhost/votes");

seedDB();

var indexRoutes = require("./routes/index"),
    pollRoutes  = require("./routes/poll");

app.set('view engine', 'ejs');
app.use("/", indexRoutes);
app.use("/poll", pollRoutes);

    
app.listen(process.env.PORT, function() {
    console.log('server started ...');
});