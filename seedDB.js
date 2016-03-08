var mongoose    = require('mongoose'),
    Poll        = require('./models/poll'),
    Option      = require('./models/option');

var data = [
    { title: "Favorite Dog" },
    { title: "Favorite Pizza" },
    { title: "Favorite Sport" }
];

function seedDB() {
    console.log('running seedDB...');
    Poll.remove({}, function() {
        
        console.log('removed all polls');
        
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
              });
                   
               option = {name: "blue", votes: 13 };
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
    });
}

module.exports = seedDB;