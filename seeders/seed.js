const mongoose = require('mongoose')
const userModel = require('../models/userModel');
require('dotenv').config();
 
mongoose.connect(process.env.MONGO_DB_CONNECTION)
    .then( async ()=>{
        await userModel.deleteMany({})
        await userModel.insertMany(data)
        mongoose.connection.close();
    })
 
const data = [
    {
        username: "admin",
        password: "1234%^",
        email: "admin@gmail.com",
        role: "admin",
    },
    {
        username: "test1",
        password: "1234%^",
        email: "djewjedje@gmail.com",
        role: "user",
    },
    {
        username: "test2",
        password: "1234%^",
        email: "98w7dmqwdmm@gmail.com",
        role: "user",
    }
]