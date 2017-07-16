var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require("multer");
var works = require('./routes/works'); 
var app = express();
var morgan = require('morgan');
var connection  = require('express-myconnection'); 
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var fs = require('fs');
// all environments
app.set('port', process.env.PORT || 1101);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(morgan('dev'));
// app.use(upload.array());
app.use(cookieParser());
app.use(session({
    secret: 'iamdeepakgupta',
    resave: true,
    saveUninitialized: true
}));
//app.use(express.favicon());

app.use(express.static(path.join(__dirname, 'public')));

var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
        if(req.session.customer)
        {
            callback(null, "./pictures/customers");
        }
        else if(req.session.shop_admin)
        {
            callback(null, "./pictures/shop_admin");
        }
        else if(req.session.outlet_admin)
        {
            callback(null, "./pictures/outlet_admin");
        }
        else if(req.session.admin)
        {
            res.redirect("/");
        }
     },
     filename: function(req, file, callback) {
        if(req.session.customer)
        {
            callback(null, "customer_" + req.session.customer.customer_id + '.jpeg' );
        }
        else if(req.session.shop_admin)
        {
            callback(null, "shop_admin_" + req.session.shop_admin.shop_admin_id  + '.jpeg');
        }
        else if(req.session.outlet_admin)
        {
            // fs.unlink('./pictures/outlet_admin'+ req.session.outlet_admin.shop_admin_id + "_" + req.session.outlet_admin.name + '.jpeg' , function(error) {
            // if (error) {
            //     throw error;
            // }
            // console.log('Deleted pic');
            callback(null, "outlet_admin_" + req.session.outlet_admin.shop_admin_id  + '.jpeg');
            // });
            
        }
        else if(req.session.admin)
        {
            res.redirect("/");
        }
     }
 });

// var upload = multer({
//      storage: Storage
//  }).array("imgUploader", 3);
// development only
// if ('development' == app.get('env')) {
//   app.use(errorHandler());
// }

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : 'Deepakgpt',
        port : 3306, //port mysql
        database:'farmers'

    },'pool') //or single

);

app.use('/stylesheet',express.static(path.join(__dirname,'./public/stylesheets')));

// local












app.get('/', function(req, res) {
req.getConnection(function(err,connection)
 {
    if(err)
    {
        console.log(err)
    }
    else
    {
        console.log("connection is good");
    }
 });
 
   if(req.session.admin)
   {
    console.log(req.session.admin)
        res.redirect("/admin/dashboard");
   }
   //  else if(req.session.shop_admin)
   //  {
   //          console.log(req.session.shop_admin)
   //          res.redirect("/shop_admin/dashboard");
   //  }
   //  else if(req.session.outlet_admin)
   //  {
   //      console.log(req.session.outlet_admin)
   //          res.redirect("/outlet_admin/dashboard");
   //  }
    else if(req.session.farmer)
    {
        console.log(req.session.farmer)
            res.redirect("/farmer/dashboard");
    }
   //      else
   //      {

   //         var index_header_data = 
   //          {
   //              page_title : "Home Page",
   //              home_link : '#',
   //              bar :
   //              [
   //              {link : '/login' , name: 'Login'},
   //              {link : '/customer/signup' , name: 'Signup'}
   //              ]
   //          };
   //          res.render("index",{header:index_header_data});
   //      }
    else
    {
    	res.redirect("/login");
    }
 
});

app.get("/farmer/sell",works.sell);
app.post("/farmer/login",works.loginFarmer);
app.post("/admin/login",works.loginAdmin);
app.get("/farmer/buy",works.buy);
app.get("/farmer/help",works.help);
app.get("/farmer/ins",works.viewSchemes);
app.get("/farmer/history",works.viewOperations);
app.get("/farmer/dashboard",works.farmerDashboard);
app.get("/admin/dashboard",works.adminDashboard);
app.post("/farmer/:operation",works.saveOperation);
app.get("/admin/view/farmers",works.viewFarmers);
app.get("/admin/view/requests",works.viewOperations);
app.get("/register",works.Register);
app.post("/register",works.savenewFarmer);
app.get("/admin/accept/request/:operation_id",works.approveOperation);
app.get("/admin/deny/request/:operation_id",works.denyOperation);
app.get("/logout",works.logout);
app.get("/login",works.login);
app.listen(8080, function(err) {
 
    if (!err)
 
        console.log("Site is live");
         
    else console.log(err)
 });
