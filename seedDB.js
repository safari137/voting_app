var mongoose    = require('mongoose'),
    Poll        = require('./models/poll'),
    Option      = require('./models/option'),
    User        = require('./models/user');

var data = [
    { title: "Favorite Dog" },
    { title: "Favorite Pizza" },
    { title: "Favorite Sport" }
];

function seedDB() {
    removeAll();
}

function removeAll() {
    Poll.remove({}, function() {
        Option.remove({}, function() {
             User.remove({}, function() {
                startSeeding();     
             });
        });
    });
}

function startSeeding() {
     data.forEach(function(poll) {
        Poll.create(poll, function(err, newPoll) {
           if (err) {
               console.log(err);
               return;
           }
           console.log('created new poll');
           var option = {name: "red", votes: 5 };
           Option.create(option, function(err, newOption) {
               if (err) {
                   console.log(err);
                   return;
               }
               console.log('created new option');
               newPoll.options.push(newOption);
               newPoll.save();
          });
        });
    });
    
    User.create({email: 'dbdill137@gmail.com', password: 'password'}, function(err, newUser) {
       if (err) {
           console.log(err);
           return;
       } 
       console.log('created user');
       Poll.create({title: "Best Diesel", owner: newUser._id}, function(err, newPoll) {
          if (err) {
              console.log(err);
              return;
          } 
          console.log('created users poll');
          newPoll.voters.push(newUser._id);
          Option.create({name: 'Cummins', votes: 0 }, function(err, newOption) {
              if (err) {
                console.log(err);
                return;
              } 
              console.log("created user's poll's option");
              newPoll.options.push(newOption);
              newPoll.save(function(err, savedPoll) {
                    if (err) {
                        console.log(err);
                        return;
                    } 
                    console.log('saved user');
                    newUser.polls.push(newPoll);
                    newUser.save();
              });
          })
       });
    });
}

module.exports = seedDB;