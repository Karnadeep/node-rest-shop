const express = require('express');
const app=express();
const morgan = require('morgan');
const bodyParser= require('body-parser');
const mongoose= require('mongoose');


mongoose.connect('mongodb://karna:'+ process.env.MONGO_ATLAS_PW +'@ds033831.mlab.com:33831/karna',
{useMongoClient: true}
).then(()=>{
    console.log('Application connected to database');
}).catch(err=> console.log('Error while connecting to the database'+ err));

mongoose.Promise=global.Promise;

const productRoutes = require('./api/routes/products');

const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Orhin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method== 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT , POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users',userRoutes);

app.get('/home', (req,res,next)=>{
    res.status(200).json({
        Name : "Anant" ,
        Age  : "26" ,
        GmailID: "anantarnav007@gmail.com"
    });
});

//Error Handling
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status|| 500).json({
        
            message : error.message
        
    });
});
module.exports=app;

//mongodb://karna:karna123@ds033831.mlab.com:33831/karna