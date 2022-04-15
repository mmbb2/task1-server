function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '5s' })
}
  
function generateRefreshToken(user) {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: '15s' })
}

const md5 = require("md5");
const jwt = require("jsonwebtoken");

class TokenController{

    async test(req, res, next){
        try{
            const token =  req.headers.authorization.split(' ')[1]
            
        if (token){

            jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user)=>{
                if (err) return res.status(401).send("access token not valid");
                return res.sendStatus(200);
            })

        } else {
            res.sendStatus(403)
        }
        }
        catch(e){
            console.log(e);
        }
    }

    async refresh(req, res, next){
        try{
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
        }
        catch(e){
            console.log(e);
        }
    }
    
}

module.exports = new TokenController();  