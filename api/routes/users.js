const express = require('express');
const router = express.Router();
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const CheckAuth = require('../middleware/check-auth');
const User = require('../models/user');


router.post('/signup',( req, res , next) => {
    User.find({email : req.body.email})
    .exec()
    .then(result => {
        if(result.length>=1){
            return res.status(409).json({
                message : "User Exists"
            });
        }else{
            bycrypt.hash(req.body.password, 10 , (err,hash)=>{
                if(err){
    
                    return res.status(500).json({
                        error : err
                    });
                }
                else{
                    const user = new User({
                        _id : mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password: hash
                    });
                    user.save()
                    .then((result) => {
            
                        console.log(result);
                        res.status(201).json({
                            message : "User Created"
                        }
            
                        );
                    }).catch((err) => {
                        res.status(500).json({
                            error : err
                        })
                    });
                }
            } )
        }
    })   
});



router.delete('/:userID', CheckAuth,  (req, res, next)=>{
    const id = req.params.userID;
    User.remove({_id : id})
    .exec()
    .then(result => {
        res.status(200).json({
            message : "User deleted"
        });
    })
    .catch((err) => {
        res.status(500).json({
            error : err
        })
    });
});

router.post('/login',(req, res, next)=>{
    User.find({email : req.body.email})
    .exec()
    .then(user => {
        if(user.length<1)
        {
            return res.status(500).json({
                
                    Message : "Auth failed"
            });
        }else{
            bycrypt.compare(req.body.password,user[0].password, (err,same)=>{
                if(err)
                {
                    return res.status(401).json({
                
                        Message : "Auth failed"
                });
                }
                if(same){
                  const token =  jwt.sign(
                      {email : user[0].password,
                        _id : user[0]._id
                    },process.env.PRIVATE_KEY,
                    {expiresIn : '1h'}
                    );
                    return res.status(201).json({
                        Message : "Auth successful",
                        token : token
                    })
                }
                return res.status(401).json({
                
                    Message : "Auth failed"
            }); 

            });
        }
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        });

    })
});

module.exports= router;