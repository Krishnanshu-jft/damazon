const express = require('express');

const Admin = require('../Models/Admin');

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
       let admin = await Admin.findOne({email});
       if(admin){
           return res.status(400).json({errors : [{msg : 'Admin already exist'}]})
       }

       admin = new Admin({
           name,
           email,
           password
       });

       const salt = await encrypt.genSalt(10);
       admin.password = await encrypt.hash(password , salt);

       await admin.save();


       //get jsontoken
       const payload = {
           admin : {
               id : admin.id
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