var express = require('express');
var md5 = require('md5');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({token: req.session.token});
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
  res.status(400).send();

  
  
});

module.exports = router;
