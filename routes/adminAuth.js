const express = require('express');
const router = express.Router();

const auth = require('../middlware/auth');

const Admin = require('../Models/Admin');

const encrypt = require('bcryptjs'); //for hasing password or for checking password

const jwt = require('jsonwebtoken');

const {check , validationResult} = require('express-validator');

const config = require('config');

//@tell about whose router is this
//@details
//@make it public or private according to the requirements

router.post('/' , [check('email','enter valid email').isEmail(),
check('password','enter password').exists()
], async(req , res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    const {email , password} = req.body;


    try{
        //see if user exist or not
        let admin = await Admin.findOne({email});

        if(!admin){
            return res.status(400).json({errors : [{msg : 'Invalid username'}]})
        }
        const ismatch = await encrypt.compare(password , admin.password);
        if(!ismatch){
            return res.status(400).json({errors : [{msg : 'Invalid password'}]});
        }

        //get jsontoken
        const payload = {
            admin : {
                id : admin.id
            }
        }
        jwt.sign(payload,
            config.get('secrettoken'),
            {expiresIn:360000},
            (err , token) => {
                if(err)
                 throw err;
                res.json({token})
            });
    } catch(err){
        console.error(err.message);
        res.status(500).send('SERVER ERROR');
    }
})
module.exports = router;