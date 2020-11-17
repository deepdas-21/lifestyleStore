//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


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
            let massage = "You have successfully signed in to our Page.Continue your Shopping by clicking below."      
            res.render("success",{successMassage: massage});
         } else {
            count = 0;
            let massage = "It seems this E-mail Account is Already Signed in.Try to Sign Up Instead."
            res.render('failiur',{failiurMassage: massage});
         }
    });

//login page

app.post("/login",function(req,res) {
    const userLogin = {
        email: req.body.email,
        password: req.body.password
    }
    let count = 0;
    for (let i = 0; i < userDetails.length; i++) {
           if (userLogin.email === userDetails[i].email && userLogin.password === userDetails[i].password) {
               count++;
           }
    }
    if (count == 1) {
        res.redirect('/products');
    } else {
        let massage = "It seems You are Not Logged In to our Server.PLease Try to Sign up Instead."
        res.render('failiur',{failiurMassage: massage});
    }
})