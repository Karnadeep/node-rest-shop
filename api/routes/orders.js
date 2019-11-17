const express= require('express');
const router = express.Router();

router.post('/',(req,res,next)=>{
    const orders= {
        productID : req.body.productID,
        quantity : req.body.quantity
    }
    res.status(201).json({
        message : 'Orders created',
        orders : orders
    });
});

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message : 'Order fetched'
    });
});

module.exports= router;