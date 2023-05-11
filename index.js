var mysql = require("mysql2")
const express = require("express");
const path = require("path");
const app = express();
const port =10014;
const hbs = require("ejs")
const alert =  require("alert");
var dateTime = require('node-datetime');
const WebSocket = require('ws');


  
const encoding = ["Under-Graduate","Graduate","Post-Graduate","Doctrate"];
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
manager.load();
const server = new WebSocket.Server({ port: 8080 });
server.on('connection', (socket) => {
    console.log('Client connected');
  
    socket.on('message', async (message) => {
      console.log(`Received message: ${message}`);
  
      // Use the NlpManager to process the message
      console.log(`${message}`.length);
      var msg = JSON.stringify(message);
      console.log(typeof(msg));
      console.log(msg.length);
  
      const respo =  await manager.process("en","bye");
      console.log(respo.answer);
      const response = await manager.process("en",`${message}`);
  
      // Send the response back to the client
      socket.send(response.answer);
    });
  
    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
  


// const popup = require('popups');
const inputs = require('./user')
// const logim = require('./login')

var cloneuser;
var email;

var last_date;
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
    res.render("userLogin.ejs",{x:"true"});
})

app.get("/officerlogin",(req,res)=>{
    res.render("officerLogin.ejs",{x:"true"});
})

app.get("/register",(req,res)=>{
    con.query("SELECT * from state", function(err, result, fields){
        res.render("register.ejs",{result});
    })
    
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
                    res.render("userHomeCenter",{result2,result});
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
app.get("/about_us",(req,res)=>{
    res.render("about_us.ejs");
})
app.get("/support",(req,res)=>{
    res.render("support.ejs");
})


app.get("/notification",(req,res)=>{
      
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');
console.log(formatted);
console.log(email);
con.query("select * from person where email=(?) ",[email],function(err, result4, fields){
    if(err) throw err;
    console.log(result4);
    con.query("SELECT * from center_policy ",function(err, result, fields){
        if(err) throw err;
        console.log(result);
        con.query("SELECT * from state_policy", function(err, result2, fields){
            if(err) throw err;
            console.log(result2);
            con.query("update person set last_active=(?) where email=(?) ",[formatted,email]);
                res.render("notification.ejs",{result2,result,result4});
            
        })
    })

})

    
    
    
})


app.get("/officerlogin",(req,res)=>{
    res.render("officerlogin.ejs",{x:"true"});
})
app.get("/admin",(req,res)=>{
    con.query("SELECT * from state", function(err, result, fields){
        if(err) throw err;
        res.render("admin.ejs",{result});
    })
})

app.get("/adminView",(req,res)=>{
    con.query("SELECT * from center_policy", function(err, result, fields){
        if(err) throw err;
        con.query("SELECT * from state_policy",function(err, result2, fields){
            if(err) throw err;
            res.render("adminView.ejs",{result, result2});
        })
    })
})

app.get("/adminDel",(req,res)=>{
    res.render("adminDel.ejs");
})
app.get("/search",(req,res)=>{
    con.connect(function(err){
        if(err){
            console.log("PROBLEM");
            throw err;
        }
        con.query("SELECT * from center_policy ",function(err, result, fields){
            if(err) throw err;
            con.query("SELECT * from state_policy", function(err, result2, fields){
                if(err) throw err;
                console.log(result2);
                res.render("search.ejs",{result2,result});
            })
        })
    })


})


app.post("/register",(req,res)=>{

    var name = req.body.Name;
    var password = req.body.password;
    var qualification =req.body.qualification;
    var ageNumber= req.body.ageNumber;
    var gender = req.body.gender;
    var email = req.body.email;
    var state = req.body.state;
    var occupassion = req.body.occupation;
    var caste = req.body.caste;
    var family_income = req.body.income;
    inputs(con, name, password, qualification, occupassion, ageNumber, gender, email,state,family_income,caste)
    res.render("userlogin",{x:"true"});
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

            if(result.length>0){
             
         if(result[0].person_password==password)
         {
            console.log("login_confirmed");
            cloneuser=result;
               con.query("SELECT * from center_policy", function(err, result2, fields){
                if(err) throw err;
                console.log(result2);
                res.render("userHomeCenter",{result2,result});
                     })

        }
         else{
                    res.render("userlogin",{x : "false"});
              
              }
            
            }
        else{
              res.render("userlogin",{x : "false"});
            }

        })
    });
    //  ans=logim(con,email, password,res);

  
 })

 app.post("/adminlogin", (req, res)=>{
    var admin_email = req.body.adminemail;
    var passwd = req.body.password;
    console.log(admin_email);

    con.query("SELECT * from admin where email = (?)", [admin_email], function(err, result2, fields){
        if(err) throw err;
        else{
            console.log(result2);
            var temp = result2[0].pass;
            if(result2.length>0){

            if(passwd==temp){
                con.query("SELECT* from state", function(err,result,fields){
                    res.render("admin",{result});
                })
                
            }
            else{
                console.log("Incorrect Password");
                res.render("officerlogin",{x:"false"});
            }

        }

            else{
                console.log("Incorrect Password");
                res.render("officerlogin",{x:"false"});
            }
        }
    })
 })

 app.post("/policy_add",(req,res)=>{

    var name = req.body.name;
    var qualification =req.body.qualification;
    var ageNumber= req.body.ageNumber;
    var gender = req.body.gender;
    var state = req.body.state;
    var occupassion = req.body.occupation;
    var caste = req.body.caste;
    var family_income = req.body.income;
    var region =  req.body.Region;
    var policy_category =  req.body.policy_category;
    var state= req.body.state;
    var link = req.body.link;
    var details =req.body.details;
    var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

    if(region==="Center"){
        var policy_id_temp= Math.random(6)*10000;
        var policy_id=Math.round(policy_id_temp);
        con.connect(function(err){
            if(err){
                console.log("PROBLEM");
                throw err;
            }
            con.query("insert into center_policy (policy_id,policy_name,policy_category,caste,age,income,occupation,qualification,gender,date_added,details,policy_link) values (?,?,?,?,?,?,?,?,?,?,?,?) ",[policy_id,name,policy_category,caste,ageNumber,family_income,occupassion,qualification,gender,formatted,details,link],function(err, result, fields){
                if(err) throw err;
                
            })
        })

    }
    else{
        var policy_id_temp= Math.random(6)*10000;
        var policy_id=Math.round(policy_id_temp);
        con.connect(function(err){
            if(err){
                console.log("PROBLEM");
                throw err;
            }
            con.query("insert into state_policy (state_policy_id,policy_name,policy_category,state,caste,age,income,occupation,qualification,gender,date_added,details,policy_link) values (?,?,?,?,?,?,?,?,?,?,?,?,?) ",[policy_id,name,policy_category,state,caste,ageNumber,family_income,occupassion,qualification,gender,formatted,details,link],function(err, result, fields){
                if(err) throw err;
                
            })
        })


    }
    con.query("SELECT * from state", function(err, result, fields){
        if(err) throw err;
        res.render("admin.ejs",{result});
    })
 })

 
 app.post("/delete_policy",(req,res)=>{

var policy_id = req.body.policy_id
// var policy_id = "2005.8096130017077";


var region = req.body.region;
// var region = "Center";


if(region==="Center"){
con.query("delete from center_policy where policy_id = (?)",[policy_id],function(err,result,fields){

    if(err)
    throw err;
    console.log("policy deleted");
});


}
else{
    con.query("delete from state_policy where state_policy_id = (?)",[policy_id], function(err,result,fields){
        if(err) throw err;
        console.log("policy deleted");
    });

}

    res.render("adminDel");
 })

 

app.listen(port,()=>{
    console.log(`successfully port connected`);
})