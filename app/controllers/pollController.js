var mongoose = require('mongoose'),
    User     = require('../models/user'),
    Poll     = require('../models/poll'),
    Option   = require('../models/option');
    
function PollController() {
    
    this.createPoll = function(req, res) {
        var title = req.body.poll.title;
        var options = req.body.poll.options.split('\r\n');
        
        Poll.create({title: title, owner: req.user._id}, function(err, createdPoll) {
           if (err) {
               console.log(err);
               return;
           } 
           options.forEach(function(option, index, array) {
               Option.create({name: option, votes: 0 }, function(err, createdOption) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    createdPoll.options.push(createdOption);
                    if (index === array.length - 1) {
                        createdPoll.save();
                        User.findById(req.user._id, function(err, user) {
                            if (err) throw err;
                            
                            user.polls.push(createdPoll);
                            user.save();
                        });
                    }
               });
           });
        });
        res.redirect('/poll');
    }
    
    
    this.deletePoll = function(req, res) {
         Poll.findById(req.params.id, function(err, poll) {
             if (err) throw err;
             
            if (poll.owner.toString !== req.user._id.toString) {
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
           Option.create({name: req.body.option, votes: 1}, function(err, newOption) {
               if (err) throw err;
               
               poll.options.push(newOption);
               
               newOption.save(function(err, result) {
                   if (err) throw err;
                   poll.voters.push(req.user._id);
                   poll.save();
                   res.end();
               });
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