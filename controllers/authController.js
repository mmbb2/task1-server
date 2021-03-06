const userModel = require('../models/userModel')
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const generator = require('generate-password');
const { use } = require('../routes');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '5s' })
}
  
function generateRefreshToken(user) {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '15s' })
}

class AuthController{

    async login(req, res, next){
        try{
            const {email, password} = req.body

            if (email && password) {

                const user = await userModel.findOne({email})
                
                if(!user){
                    res.status(401).json({message: "invalid email"});
                }

                if(md5(password) !== user.password){
                    res.status(401).json({message: "invalid password"});
                }

                const userData = {
                    _id: user._id,
                    username: user.username,
                    password: md5(user.password),
                    email: user.email,
                    role: user.role,
                }

                const accessToken = generateAccessToken(userData)
                const refreshToken = generateRefreshToken(userData)

                res.header('Authorization', accessToken);
                res.set("Authorization", accessToken);
                res.cookie('refreshToken', refreshToken, { maxAge: 60 * 1000, httpOnly: true });
                res.json(userData)
              

            } else {
                res.status(400).json({message: "invalid data"});
            }
        }
        catch(e){
            console.log(e);
        }
    }

    async logout(req, res, next){
        try{
            res.clearCookie('refreshToken');
            res.sendStatus(200)
        }
        catch(e){
            console.log(e);
        }
    }

    async registration(req, res, next){
        try{
            const {email} = req.body
            if(email){
                const candidate = await userModel.findOne({ email }); 

                if (candidate){
                    res.status(400).json({message: "email already used"});
                    throw new Error(`email already used`);
                }

                const username = email.split('@')[0]
    
                const password = generator.generate({
                    length: 10,
                    numbers: true,
                    excludeSimilarCharacters: true
                  }) + generator.generate({
                    length: 2,
                    uppercase: false,
                    lowercase: false,
                    symbols: true,
                  })
    
                const user = await userModel.create({email, password: md5(password), username, role: 'user'})
                res.json({
                    username: user.username,
                    password,
                    email: user.email
                })
            }
           
        }
        catch(e){
            console.log(e);
        }
    }
    
}

module.exports = new AuthController();  