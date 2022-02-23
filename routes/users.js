var express = require('express');
var md5 = require('md5');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.token){
    res.send({token: req.session.token});
  } else {
    res.status(401).send()
  }
  
});

router.post('/auth', function(req, res, next) {

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const {email, password} = req.body

  if(email, password){
    if(validateEmail(email)){
      let token = md5(req.body.email)
      req.session.token = token
      console.log(req.session)
      res.send({token});
    }
  } 
  res.status(400).json({message: "invalid data"});

});

router.post('/logout', function(req, res, next){
  req.session.destroy()
  res.send()
})

module.exports = router;
