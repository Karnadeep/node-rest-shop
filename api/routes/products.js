const express= require('express');
const router= express.Router();
const Product = require('../models/product');
const mongoose= require('mongoose');
const multer = require('multer');

const CheckAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

const fileFilter   = (req, file, cb)=>{
    if (file.mimetype=== 'image/jpeg'|| file.mimetype==='image/png'){
        cb(null, true);
    }
    else {
        cb(null,false);
    }
};

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null,'./uploads/');
    },
    filename : function(req, file,cb){
        cb(null,new Date().toISOString() + file.originalname);
    } 
});
const upload = multer({storage : storage , 
    limits: {fileSize : 1024* 1024 * 5},
    fileFilter : fileFilter
    
});
router.post('/', CheckAuth, upload.single('productImage'), ProductController.product_create);

router.get('/:productID',ProductController.product_get_specific_product);

router.get('/',ProductController.product_get_all);

router.patch('/:productID', CheckAuth ,ProductController.product_update);

router.delete('/:productID', CheckAuth, ProductController.product_delete);

module.exports= router;