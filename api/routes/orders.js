const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order= require('../models/order');

router.post('/',(req,res,next)=>{
    const order = new Order({
        _id :  mongoose.Types.ObjectId(),
        quantity : req.body.quantity,
        product : req.body.product
    });
    order.save()
    .then(result=>{
        res.status(201).json();
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        })
    });
});

router.get('/',(req,res,next)=>{
    Order.find()
    .select('name price _id')
    .exec()
    .then(orderList =>{
        const count = orderList.length;
        const orders = orderList.map(singleorder={
            return :{
                 orderID : singleorder._id,
                 quantity: singleorder.quantity,
                 product : singleorder.product,
                 request : {
                     type : 'GET',
                     URL  : 'http:localhost:3000/orders/' + singleorder._id
                 }
            }
        });

        res.status(200).json(orderList);

        
    }

    )
    .catch();
});

module.exports= router;