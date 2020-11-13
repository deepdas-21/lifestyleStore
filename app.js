const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/",function(req,res){
    res.render('index');
})

app.get("/signup",function(req,res){
    res.render('signup');
})

app.get("/login",function(req,res){
    res.render('login');
})

app.get("/products",function(req,res){
    res.render('products');
})

app.listen(3000,function(){
    console.log("server started at port 3000");
})