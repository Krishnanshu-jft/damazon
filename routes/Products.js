const express = require('express');
const {check , validationResult} = require('express-validator');

const router = express.Router();

const Admin = require('../Models/Admin');

const User = require('../Models/User')

const Product = require('../Models/products');

const auth = require('../middlware/auth');

const auth1 = require('../middlware/auth1')

//@router - /routes/product
//@details - details of the products
//@make - private
router.post('/',[auth ,
[
    check('name','Enter name of product').not().isEmpty(),
    check('details','Enter details').not().isEmpty(),
    check('price','enter price'),
    check('quantity','enter quantity')
]],
    async(req , res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        try{
            if(req.admin.id){
            let product = await Admin.findById(req.admin.id);
            console.log(req.body);
            const {name , details , price , quantity} = req.body;
            product = new Product({
                name,
                details,
                price,
                quantity
            })
            await product.save();
            return res.status(400).json({msg : 'add products'})
            }
           // console.log(user.id);
         
            
        }catch(err){
            console.error(err.message),
            
           res.status(400).json({msg : 'cannot add products'})
        }
    })

    module.exports = router;