var express         = require('express'),
    Poll            = require('./models/poll'),
    Option          = require('./models/option'),
    User            = require('./models/user'),
    UserController  = require('./controllers/userController'),
    PollController  = require('./controllers/pollController');
   

function routes(app, passport) { 
     var userController  = new UserController(passport),
         pollController  = new PollController();
         
    app.route("/")
        .get(function(req, res) {
            res.redirect("/poll");
        });
    
    // SIGN UP AND LOGIN
    app.route("/signup")
        .get(function(req, res) {
            res.render("signup", {isAuthenticated: req.isAuthenticated(), message: req.flash('signupMessage')}); 
        })
        .post(userController.signUpUser); 
    
    app.route("/login")
        .get(function(req, res) {
            res.render("login", {isAuthenticated: req.isAuthenticated(), message: req.flash('loginMessage')});  
        })
        .post(userController.loginUser);
    
    app.route("/logout")
        .get(function(req, res) {
            req.logout();
            res.redirect("/");
        });
        
    app.get("/profile", userController.showProfile);
    
    
    // POLL
    app.route("/poll")
        .get(pollController.getAllPolls)
        .post(isLoggedIn, pollController.createPoll);
        
    
    app.route("/poll/new")
        .get(isLoggedIn, function(req, res) {
            res.render('polls/new', {isAuthenticated: req.isAuthenticated()});
        });
    
    app.route("/poll/:id")
        .get(pollController.showPoll)
        .delete(isLoggedIn, pollController.deletePoll);
    
    app.route("/poll/:pollid/option")
        .post(isLoggedIn, pollController.addOption)
        
    app.route("/poll/:pollid/vote").post(pollController.incrementVote);
    
    app.route("/poll/vote/:optionId").get(pollController.getVotes);
    
    app.route("/api/poll/:id/options").get(pollController.jsonGetOptions);
    
    app.route("/*").get(function(req, res) { res.redirect("/") });
}


module.exports = routes;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}