const userModel = require('../models/userModel')

class UserController{

    async getUsersByIds(req, res, next){
        try{
            const {ids} = req.body

            const users = await userModel.find({ _id: { $in: ids } })


            const resUsers = {}

            users.forEach((user)=>{
                resUsers[user._id] = user
            })

            console.log(resUsers)

            res.json(resUsers)
        }
        catch(e){
            console.log(e);
        }
    }

}

module.exports = new UserController();  