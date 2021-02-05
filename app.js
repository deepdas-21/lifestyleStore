//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


app.set('view engine', 'ejs');

app.use(express.static("public"));//static files
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/productsDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    contact: Number,
    address: String,
    productsBrought: Array
})

const customerSchema = new mongoose.Schema({
    name: String,
    products: Array
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user",userSchema);
const Product = mongoose.model("product",productSchema);
const Customer = mongoose.model("customer",customerSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render('index');
})

app.get("/signup",function(req,res){
    res.render('signup');
})

app.get("/login",function(req,res){
    res.render('login');
})

app.get("/cart",function(req,res){
    if(req.isAuthenticated()){
        const productsArray = req.user.productsBrought;
        res.render('cart',{products: productsArray});
    } else {
        res.redirect('/login');
    }
})

app.get("/products",function(req,res){
    if(req.isAuthenticated()){
        res.render('products');
    } else {
        res.redirect('/login');
    }
})

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
})


//signup
app.post("/signup",function(req,res){
    
    User.register({
        name: req.body.Name,
        username: req.body.username,
        contact: req.body.contact,
        address: req.body.address
    },req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            res.redirect('/');
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/products");
            })
        }
    })

    });

//login page

app.post("/login",function(req,res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/products");
            })
        }
    })
})

app.post("/products",function(req,res){
    Product.countDocuments({name: req.body.title , price: req.body.price},function(err,count){
        if(!err)
        {
            if(count === 0)
            {
                const product = new Product({
                name: req.body.title,
                price: req.body.price
                });
                product.save();
                var userArray = req.user.productsBrought;
                userArray.push(product);
                User.findById(req.user._id,function(err,foundUser){
                    if(!err)
                    {
                        foundUser.productsBrought = userArray;
                        foundUser.save(function(err){
                            if(!err)
                            {
                                res.redirect("/products");
                            }
                        });
                    }
                }) 
            }
        }
    });
    Product.findOne({name: req.body.title,price: req.body.price},function(err,foundProduct){
        if(!err)
        {
            var userArray = req.user.productsBrought;
                userArray.push(foundProduct);
                User.findById(req.user._id,function(err,foundUser){
                    if(!err)
                    {
                        foundUser.productsBrought = userArray;
                        foundUser.save(function(error){
                            if(!error){
                                res.redirect("/products");
                            }
                        });
                    }
                })
        }
    })
})


app.post("/cart",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(!err)
        {
            const newCustomer = new Customer({
                name: foundUser._id,
                products: foundUser.productsBrought
            })
            newCustomer.save();
            foundUser.productsBrought = [];
            foundUser.save();
        }
    })
    res.render("success",{successMassage: "Your Order has been Placed.Thank you for shopping with us"});
})

app.post("/delete",function(req,res){
    User.findById(req.user._id,function(err,foundUser){
        if(!err)
        {
            const productsBrought = req.user.productsBrought;
            productsBrought.splice(req.body.item,1);
            foundUser.productsBrought = productsBrought;
            foundUser.save(function(error){
                if(!error){
                    res.redirect("/cart");
                }
            });
        }
    })
})

app.listen(3000,function(){
    console.log("server started at port 3000");
})