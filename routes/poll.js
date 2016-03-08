var express = require('express'),
    router  = express.Router(),
    Poll    = require('../models/poll');
    
router.get("/", function(req, res) {
    Poll.find({}, function(err, polls) {
        if (err) {
            console.log(err);
            return;
        }
        
       res.render('polls/index', {polls: polls}); 
    });
});

router.get("/:id", function(req, res) {
   Poll.findById(req.params.id).populate("options").exec(function(err, poll) {
       if (err) {
           console.log(err);
           return;
       }
       res.render('polls/show', { poll: poll});
   }); 
});

router.put("/", function(req, res) {
    
});

module.exports = router;