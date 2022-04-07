require('dotenv').config();
var express = require('express');
var md5 = require('md5');
var router = express.Router();
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '5s' })
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '15s' })
}

router.get('/', function(req, res, next) {

  const token =  req.headers.authorization.split(' ')[1]

  if (token){

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user)=>{
      if (err) return res.status(401).send("access token not valid");
      return res.sendStatus(200);
    })

  } else {
    res.sendStatus(403)
  }
});

router.post('/refresh', function(req, res, next) {

  if(!req.cookies?.refreshToken) return res.sendStatus(403)

  const { refreshToken } = req.cookies;

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, data)=>{
      if (err) {
        console.log(err)
        return res.sendStatus(403);
      }
      const accessToken = generateAccessToken({email: data.email, password: data.password})
      res.header('Authorization', accessToken);
      return res.sendStatus(200);
  })

  
});

router.post('/auth', function(req, res, next) {

  const {email, password} = req.body

  if (email && password) {
    const user = {
      email,
      password: md5(password)
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.header('Authorization', accessToken);
    res.set("Authorization", accessToken);
    res.cookie('refreshToken', refreshToken, { maxAge: 60 * 1000, httpOnly: true });
    res.sendStatus(200)

  }else{
    res.status(400).json({message: "invalid data"});
  }
  

});

router.post('/logout', function(req, res, next){
  res.clearCookie('refreshToken');
  res.sendStatus(200)
})

module.exports = router;
