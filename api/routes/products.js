const express= require('express');
const router= express.Router();
const mongoose= require('mongoose');

const Product = require('../models/product');


router.post('/',(req, res, next) => {
    const product= new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        }
    );
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message : 'Handling Post requests to products',
            products : result
        });
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

router.get('/:productID', (req,res,next)=> {
    const id = req.params.productID;
    Product.findById(id).exec().then(doc => {
        if(doc== null)
        {
            console.log('Not a valid ID');
            res.status(404).json({
                message : 'The entered ID Not a valid ID'
            });
        }
        else{
        console.log('From database',doc);
        res.status(200).json(doc);
        }
    }
    ).catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
            
        });
    });
}
);

router.get('/',(req,res,next)=> {
    Product.find()
    .exec()
    .then(doc=>{
        console.log(doc);
       // if(doc.length>=0){
            res.status(200).json(doc);

       // }
        //else{
          //  console.log('No records');
            //res.status(404).json({
            //    message : 'No Entries found'
         //   });
        //}
    }).catch(err=>
        {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:productID',(req, res, next) => {
    const id = req.params.productID;
    const UpdateOps= {};
    for (const ops of req.body){
        UpdateOps[ops.propName] = ops.value ;
    }

    Product.update({_id : id},{$set : UpdateOps})
    .exec()
    .then(result=>
        {
            console.log(result)
            res.status(200).json(result)
        })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

router.delete('/:productID',(req, res, next) => {
    const id= req.params.productID;
    Product.remove({_id : id})
    .exec()
    .then(result=>
        {
            res.status(200).json(result);
        })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports= router;