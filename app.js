//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const { fileLoader } = require('ejs');


mongoose.connect('mongodb://localhost:27017/productsDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: Number,
    address: String
});

const User = mongoose.model("user",userSchema);

let userDetails = [""];

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
    res.render('cart');
})

app.get("/products",function(req,res){
    res.render('products');
})

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
                    res.redirect("/products");
                }
            })
            console.log("true");
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
            res.redirect("/products");
        } else {
            res.render("failiur",{failiurMassage: "Your Account doesn't exist in our database.Try to Signup Instead!"});
        }
    })
})