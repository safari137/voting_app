var express     = require('express'),
    router      = express.Router();
    
    
router.get("/", function(req, res) {
    res.send("Landing Page");
});


module.exports = router;