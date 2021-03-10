const jwt = require('jsonwebtoken');
const config = require('config');

module.export = function(req , res , next){
    //get token header

    const token = req.header('x-auth-token');

    //check if token exist or not

    if(!token){
        return res.status(401).json({msg : 'No token , Authraziation denied'})
    };

    //to verify
 try{
     const decode = jwt.verify(token , config.get('secrettoken'));
    req.admin = decode.admin;
    next();
}catch(err){
    res.status(401).json({msg : 'Not Verified'})
}
}