const Product = require('../models/product');
const mongoose = require('mongoose');

exports.product_create = (req, res, next) => {
    console.log(req.file);
    const product= new Product(
        {
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage : req.file.path
        }
    );
    product.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message : 'Product Created',
            Createdproducts : {
                name : result.name,
                price: result.price,
                _id: result._id,
                productImage : result.productImage
            },            
                request : {
                    type : 'POST',
                    description: "Click on the below link to see view details of created products",
                    url  :  'http://localhost:3000/products/' + result._id
                }
            
        });
        
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
}

exports.product_get_all= (req,res,next)=> {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docslist=>{
        console.log(docslist);
        const output={
            count : docslist.length,
            products: docslist.map(singledoc=>{
                const index=docslist.indexOf(singledoc);
                return {
                name : singledoc.name,
                price : singledoc.price,
                _id : singledoc._id,
                productImage : singledoc.productImage,
                request : {
                    type : "GET",
                    url :  "http://localhost:3000/products/" + singledoc._id
                },
                index : index
                }
                }
            )
        };
       // if(doc.length>=0){
            res.status(200).json(output);

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
}
exports.product_get_specific_product= (req,res,next)=> {
    const id = req.params.productID;
    Product.findById(id)
    .select('price name _id productImage')
    .exec()
    .then(doc => {
        if(doc== null)
        {
            console.log('Not a valid ID');
            res.status(404).json({
                message : 'The entered ID Not a valid ID'
            });
        }
        else{
        console.log('From database',doc);
        res.status(200).json({
            Selectedproduct: doc,
            request:{
                type: "GET",
                Description: "Click on the below link to get all the products",
                url        : "http://localhost:3000/products"
            }
        }
            );
        }
    }
    ).catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
            
        });
    });
}

exports.product_delete=  (req, res, next) => {
    const id= req.params.productID;
    Product.remove({_id : id})
    .exec()
    .then(result=>
        {
            res.status(200).json({
                message : "Product deleted successfully",
                request: {
                    type : 'Post',
                    url : "http://localhost:3000/products",
                    data:{
                        name : "String",
                        price : "Number"
                    }
                }
            });
        })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.product_update = (req, res, next) => {
    const id = req.params.productID;
    const UpdateOps= {};
    for (const ops of req.body){
        UpdateOps[ops.propName] = ops.value ;
    }

    Product.update({_id : id},{$set : UpdateOps})
    .select('name price _id productImage')
    .exec()
    .then(result=>
        {
            console.log(result);
            res.status(200).json({
                message : "Product Updated successfully",
                request:{
                    type : "PATCH",
                    description: "Click on the below linlk to view details of updated products",
                    url :  "http://localhost:3000/products/" + id

                }
            })
        })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}