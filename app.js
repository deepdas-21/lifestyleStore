const alert = require('js-alert')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();


let userDetails = [""];

app.set('view engine', 'ejs');

app.use(express.static("public"));
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

app.post("/signup",function(req,res){
    let count = 0;
    const userSignup={
         name: req.body.userName,
         email: req.body.userEmail,
         password: req.body.password,
         contact: req.body.contact,
         address: req.body.address
    }
        for (let i = 1; i < userDetails.length; i++) {
          if (userDetails[i].email === userSignup.email) {   
                count++;
          }
         }
         if (count == 0) {
            userDetails.push(userSignup);      
            res.render("success");
         } else {
            res.render('failiur');
         }
    });