var mysql = require("mysql2")
const express = require("express");
const path = require("path");
const app = express();
const port =4000;
const hbs = require("ejs")
const alert =  require("alert");
// const popup = require('popups');
const inputs = require('./user')
// const logim = require('./login')

var cloneuser;
var email;


var con = mysql.createConnection({
    host : "localhost",
    user : "root",
   password : "tanish@0601",
    database  : "policy"
});
app.use(express.json());
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: false }));    
app.use('/static', express.static(path.join(__dirname, 'static')))
app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.get("/userLogin",(req,res)=>{
    res.render("userLogin.ejs");
})

app.get("/officerlogin",(req,res)=>{
    res.render("officerLogin.ejs");
})
app.get("/register",(req,res)=>{
    res.render("register.ejs");
})
app.get("/userHome",(req,res)=>{
    res.render("userHome.ejs");
})

app.get("/userHomeCenter", (req,res)=>{
    //             res.render("userHomeCenter",{result});
        con.connect(function(err){
            if(err){
                console.log("PROBLEM");
                throw err;
            }
            con.query("SELECT * from person where email = (?) ", [email],function(err, result, fields){
                if(err) throw err;
                con.query("SELECT * from center_policy", function(err, result2, fields){
                    if(err) throw err;
                    console.log(result2);
                    res.render("userHomeState",{result2,result});
                })
            })
        })
    
        
    })
    
    
app.get("/userHomeState", (req,res)=>{
//             res.render("userHomeCenter",{result});
    con.connect(function(err){
        if(err){
            console.log("PROBLEM");
            throw err;
        }
        con.query("SELECT * from person where email = (?) ", [email],function(err, result, fields){
            if(err) throw err;
            con.query("SELECT * from state_policy", function(err, result2, fields){
                if(err) throw err;
                console.log(result2);
                res.render("userHomeState",{result2,result});
            })
        })
    })

    
})


app.get("/index",(req,res)=>{
    res.render("index.ejs");
})


app.post("/register",(req,res)=>{

    var name = req.body.Name;
    var password = req.body.password;
  var qualification ="matric"
    var ageNumber= req.body.ageNumber;
    var gender = req.body.gender;
    var email = req.body.email;
    var occupassion = "student";
    var caste = "General";
    var family_income = "10000";
    inputs(con, name, password, qualification, occupassion, ageNumber, gender, email,family_income,caste)
    res.render("userlogin");
 });

 app.post("/userlogin", (req,res)=>{
    var password = req.body.password;
     email = req.body.email;
    console.log(email);
    console.log(password);
    con.connect(function(err){
        if(err) {
            console.log('PROBLEM!!!');
            throw err;
        }
       
        con.query("SELECT * from person where email = (?) ", [email], function(err, result, fields){
            if (err) throw err;
             console.log(result);
            if(result.length>0){
             
             if(result[0].person_password==password){
                console.log("login_confirmed");
            cloneuser=result;
 con.query("SELECT * from center_policy", function(err, result2, fields){
            if(err) throw err;
            console.log(result2);
            res.render("userHomeCenter",{result2,result});
        })

                }}
                else{
                    
                  res.render("userlogin");
            
            }

        })
    });
    //  ans=logim(con,email, password,res);

  
 })




app.listen(port,()=>{

    console.log(`successfully port connected`);
})