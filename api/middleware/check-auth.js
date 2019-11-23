const jwt= require('jsonwebtoken');

module.exports = (req,res, next)=>{
    try{
        console.log(req.headers.authorization);
        const token = req.headers.authorization.split(" ")[1];
   const decode= jwt.verify(token, process.env.PRIVATE_KEY);
    req.userData = decode;
   next();
    }catch(err){
        res.status(401).json({
            message : "Auth failed"
        });
    }
}
