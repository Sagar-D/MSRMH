var express = require('express');
var http = require('http');

var login = require('./routes/login');
var validate = require('./routes/validate');
var admin = require('./routes/admin/admin');
var emp = require('./routes/emp/emp');

var app = express();
app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(3000);
console.log("Server is running....");

var session = require('express-session');
app.use(session({secret : "BlackPearl", resave : true, saveUninitialized : true}));

app.get('/',login);
app.get('/login/',login);

app.post('/validate',validate);

app.get('/admin/admin',admin);
app.get('/emp/emp',emp);
