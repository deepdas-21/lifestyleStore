//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const { fileLoader } = require('ejs');
const { static } = require('express');


mongoose.connect('mongodb://localhost:27017/productsDB', {useNewUrlParser: true, useUnifiedTopology: true});

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
    email: String,
    password: String,
    contact: Number,
    address: String,
    productsBrought: Array
});

const User = mongoose.model("user",userSchema);
const Product = mongoose.model("product",productSchema);


app.set('view engine', 'ejs');

app.use(express.static("public"));//static files
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render('index');
})

app.get("/signup",function(req,res){
    res.render('signup');
})

app.get("/login",function(req,res){
    res.render('login');
})

app.get("/settings",function(req,res){

    res.render("settings");
})

app.get("/cart",function(req,res){
        res.render('cart',{products: productArray});
})

app.get("/products",function(req,res){
    res.render('products');
});

app.listen(3000,function(){
    console.log("server started at port 3000");
})

//signup
app.post("/signup",function(req,res){
    User.findOne({email: req.body.userEmail,password: req.body.password},function(err,founditem){
        if(founditem === null)
        {
            const user = new User({
                name: req.body.userName,
                email: req.body.userEmail,
                password: req.body.password,
                contact: req.body.contact,
                address: req.body.address
           });
            user.save(function(err){
                if(!err)
                {
                    res.redirect("/login");
                }
            })
        } else {
          res.render("failiur",{failiurMassage: "It seems You are already a member of our family.Try to login instead."});
        }
    })   
    });

//login page

app.post("/login",function(req,res) {
    User.findOne({email: req.body.email,password: req.body.password},function(err,founditem){
        if(founditem !== null)
        {
            res.redirect('/'+founditem._id);
        } else {
            res.render("failiur",{failiurMassage: "Your Account doesn't exist in our database.Try to Signup Instead!"});
        }
    })
})

app.get("/:name",function(req,res){
    res.render('products',{
        id: req.params.name
    });
})

let productArray = [];
app.post("/products",function(req,res){
    const title = req.body.title;
    const price = req.body.price;
    const id = req.body.id;
    const product = new Product({
        name: title,
        price: price
    });
    productArray.push(product);
    User.updateOne({_id: id},{productsBrought: productArray},function(err){
        if(!err){
            console.log("successfully updated");
        }
    });
    Product.findOne({name: title,price: price},function(err,founditem){
        if(founditem === null)
        {
            product.save(function(err){
                if(!err)
                {
                    res.redirect("/"+id);
                }
            });
        } else {
            res.redirect("/"+id);
        }
    });
})


app.post("/cart",function(req,res){
    res.render("success",{successMassage: "Your Order has been Placed.Thank you for shopping with us"});
})

app.post("/settings",function(req,res){
    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    User.updateOne({email: email,password:oldPassword},function(err){
        if(err){
            res.render("failiur",{failiurMassage: "There is a problem while setting up your password.Please try again later."});
        } else {
            res.render("success",{successMassage: 'Successfully Updated your new Password.Please Login with  your new Password'});
        }
    })
})