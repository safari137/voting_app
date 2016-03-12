var mongoose = require('mongoose'),
    User     = require('../models/user'),
    Poll     = require('../models/poll'),
    Option   = require('../models/option');
    
function PollController() {
    
    this.createPoll = function(req, res) {
        var title = req.body.poll.title;
        var options = req.body.poll.options.split('\r\n');
        
        Poll.create({title: title, owner: req.user._id}, function(err, createdPoll) {
            if (err) throw err;
            
            addAllOptionsToPoll(options, createdPoll, function() {
                pushPollToUser(createdPoll, req.user._id);   
            });   
            
        });
        res.redirect('/poll');
    }
    
    var addAllOptionsToPoll = function(options, poll, callback) {
        options.forEach(function(option, index, array) {
            createOption(option, 0, function(option) {
                poll.options.push(option);
                
                if (index === array.length - 1) {
                    callback(poll);
                    poll.save();
                }
            });
        });
    }
    
    var createOption = function(name, votes, callback) {
        Option.create({name: name, votes: votes}, function(err, option) {
            if (err)  throw err;
            
           callback(option); 
        });
    }
    
    var pushPollToUser = function(poll, userId) {
        User.findById(userId, function(err, user) {
            if (err) throw err;
            
            user.polls.push(poll);
            user.save();
        });
    }
    
    
    this.deletePoll = function(req, res) {
         Poll.findById(req.params.id, function(err, poll) {
            if (err) throw err;
            
            var isOwner = (poll.owner.toString === req.user._id.toString);
            
            if (!isOwner) {
                res.end();
                return;
            }
                
            Poll.findByIdAndRemove(req.params.id, function(err) {
                if (err) throw err;
                res.end();
            });
        });
    }
    
    
    this.getAllPolls = function(req, res) {
        Poll.find({}, function(err, polls) {
            if (err) {
                console.log(err);
                return;
            }
            
           res.render('polls/index', {polls: polls, isAuthenticated: req.isAuthenticated()}); 
        });
    }
    
    
    this.showPoll = function(req, res) {
        Poll.findById(req.params.id).populate("options").exec(function(err, poll) {
           if (err) {
               console.log(err);
               return;
           } 
           if (req.user) {
               var isOwner = (poll.owner !== undefined) ? (poll.owner.toString() === req.user._id.toString()) : false,
                   canVote = (req.isAuthenticated() && !hasVoted(req.user, poll)),
                   userInfo = { email: req.user.email, id: req.user._id, isOwner: isOwner, canVote: canVote};
           } else {
                userInfo = { isOwner: false, user: { canVote: false}};
           }
           
           res.render("polls/show", {poll: poll, user: userInfo, isAuthenticated: req.isAuthenticated()});
        });
    }
    
    
    this.getVotes = function(req, res) {
        Option.findById({_id: req.params.optionId}, function(err, result) {
          if (err) {
              console.log(err);
              return;
          }
          res.json(result); 
       });
    }
    
    
    this.incrementVote = function(req, res) {
        Poll.findById(req.params.pollid, function(err, poll) {
            if (err) throw err;
            
            if (hasVoted(req.user, poll))
                return;
            
            Option.findById(req.body.optionId, function(err, option) {
                if (err) throw err;
                
                option.votes++;
                poll.voters.push(req.user._id);
                option.save(function(err, result) {
                    if (err) throw err;
                    poll.save();
                });
            });
        });
        res.end();
    }
    
    
    this.addOption = function(req, res) {
        
        Poll.findById(req.params.pollid, function(err, poll) {
           if (err) throw err;
           
           if (hasVoted(req.user, poll)) {
               res.end();
               return;
           }
           
           if (!req.body.option) return;
           
           createOption(req.body.option, 1, function(option) {
              poll.options.push(option); 
              poll.voters.push(req.user._id);
              poll.save();
              res.end();
           });
        });
    }
    
    
    this.jsonGetOptions = function(req, res) {
        Poll.findById(req.params.id).populate("options").exec(function(err, poll) {
            if (err) throw err;
            
            res.json(poll.options);
        });
    }
    
    
    var hasVoted = function(user, poll) {
        var hasVoted = poll.voters.filter(function(value) {
            return (value._id.toString() === user._id.toString());
        }).length > 0;
        
        return hasVoted;
    }
}

module.exports = PollController;