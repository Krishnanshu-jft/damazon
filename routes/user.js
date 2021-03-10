const express = require('express');

const User = require('../Models/User');

const jwt = require('jsonwebtoken')

const config = require('config')

const encrypt = require('bcryptjs')

const router = express.Router();

const {check , validationResult} = require('express-validator');
const { userInfo } = require('os');

router.post('/' , [
    check('name' , 'Enter valid name').not().isEmpty(),
    check('email' , 'Enter valid email').isEmail(),
    check('password','Enter valid password of 6 character').isLength({min : 6})
] , async(req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const {name , email , password} = req.body;
     
   try{
       //see if the user exist
       let user = await User.findOne({email});
       if(user){
           return res.status(400).json({errors : [{msg : 'user already exist'}]})
       }

       user = new User({
           name,
           email,
           password
       });

       const salt = await encrypt.genSalt(10);
       user.password = await encrypt.hash(password , salt);

       await user.save();


       //get jsontoken
       const payload = {
           user : {
               id : user.id
           }
       }
       jwt.sign(payload , 
        config.get('secrettoken'),
        (err , token) =>{
            if(err)
            throw err;
            res.json({token})
        });
   }catch(err){
       console.log(err.message);
       res.status(500).send('SERVER ERROR');
   }

})
module.exports = router;