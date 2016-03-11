var User        = require("../models/user"),
    mongoose    = require("mongoose");
    
function UserController(passport) {
    this.signUpUser = passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup'
    });
    
    
    this.loginUser = passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login'
    });
    
    this.showProfile = function(req, res) {
        User.findOne({email: req.user.email}).populate("polls").exec(function(err, user) {
            if (err) {
                console.log(err);
                return;
            }
            res.render('profile', {user: user, isAuthenticated: req.isAuthenticated()});
        });
    };
}

module.exports = UserController;


