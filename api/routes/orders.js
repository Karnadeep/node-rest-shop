const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const Order= require('../models/order');

router.post('/',(req,res,next)=>{
    const product = req.body.product;
    Product.findById(product).then(response =>{
        if(response){
            const order = new Order({
                _id :  mongoose.Types.ObjectId(),
                quantity : req.body.quantity,
                product : req.body.product
            });
            return order.save()
            .then(result=>{
                res.status(201).json(result);
            })
        }
        else {
            res.status(404).json({
                message : "Product not found"
            })
        }
    
})
    .catch(err=>{
        res.status(500).json({
            error : err
        })
    });
});

router.get('/',(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(orderList =>{
    
        const result = {
            count : orderList.length,
            orders : orderList.map(singleorder =>{
                return  {
                    _id : singleorder._id,
                    quantity: singleorder.quantity,
                    product : singleorder.product,
                    request : {
                        type : 'GET',
                        url : 'http:localhost:3000/orders/' + singleorder._id
                    }
                }
            })
            
        }
        res.status(200).json(result);
    }  
    )
    .catch(err =>
        {
            res.status(500).json({
                error : err
                
            });
        });
});

router.get('/:orderID',(req, res,next) => {
    Order.findById(req.params.orderID)
    .select('product quantity _id')
    .exec()
    .then(fetchedOder =>{
        if(!fetchedOder){
            res.status(404).json({
                message : "Order Not Found"
            })
        }
        else{
        const result = {
           
            order : fetchedOder,
            request : {
                type : 'GET',
                url : 'http:localhost:3000/orders/',
                description : 'Click on the above linke to view all the orders'
            }
        }
        res.status(200).json(result);
    }
    }
    )
    .catch(err =>
        {
            res.status(500).json({
                error : err
                
            });
        });
});
 
router.delete('/:orderID',(req, res, next)=>{
    const id = req.params.orderID;
    Order.remove({_id : id}).exec()
    .then(result=>
        {
            res.status(200).json({
                message : "Order deleted successfully",
                request: {
                    type : 'Post',
                    url : 'ttp:localhost:3000/orders/',
                    description: "click on the above link to create a new order and pass the below data parameters",
                    data : {
                        product : "Product_id of a product",
                        quantity : 'Number'
                    }
                }
            
            })
        }
    )
    .catch(err =>
        {
            res.status(500).json({
                error : err
                
            });
        });
});
module.exports= router;