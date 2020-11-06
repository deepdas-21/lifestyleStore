const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/",function(req,res){
    res.render('index');
})

app.listen(3000,function(){
    console.log("server started at port 3000");
})