const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const details = require("./details.json");

const app = express();

// 
var fs = require('fs');
var http = require('http');
var https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};


// 

var Systime = require('systime') 
var systime = new Systime()


app.use(cors({ origin: "*" }));
app.use(bodyParser.json());


//captcha
const axios = require('axios');
//
// var httpsServer = https.createServer(credentials, app);
//



const port = process.env.PORT || 8080  ;
app.listen(port, () => {
  console.log("The server started on port "+port+" !!!!!!");
});

app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>Wellcome to Mail server <br><br>😃👻😃👻😃👻😃👻😃</h1><br> <p> Hasaru Rajapakse<p>"
  );
});



// app.post("/verify", (req, res) => {

 
//   // axios.post(url).then(response =>{
//   //   console.log("captcha = "+response.data.sucess);
//   //   if (response.data.sucess) {
//   //     console.log('dddddddddddddd');
//   //     res.status(200).json({
//   //       ressponse:"Verified"
//   //     });
//   //   }
    
//   // //  if (response.data.error-codes) {
//   // //   console.log('*****************');
//   // //   console.log(response.data.error-codes);
//   // //  }
//   //   res.status(401).json({
      
//   //     error:"Verify failed"
      
//   //   });
    
//   // }).catch(error =>{
//   //   console.log(error);
//   //   res.status(500).json({
//   //     error:"not responding"
//   //   });
//   // })

// });


//with captcha
app.post("/sendmailSecured", (req, res) => {
  console.log("request came");
  let user = req.body;

  console.log("captcha request came"); 
  var secretKey = '6LdNYscaAAAAAL__bqhRO8sgRLNkpVR7eYHdn9ff';
  var userKey= user.token; 
  
  var url= 'https://www.google.com/recaptcha/api/siteverify?secret='+secretKey+'&response='+userKey;
 
   axios.post(url)
  .then((response) => {
    console.log("////////////////////////////////////////////");
     console.log(response.status);
    console.log("###############################################");

    //mail sender
    if (response.status = 200) {
      sendMail(user, info => {
        console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
        console.log(`Sender ${user.name}`);
       
        res.status(200).send(info);    
      });
    }
    //mail sender end

  }, (error) => {
    console.log("***********************************************");
    console.log("error");
    console.log(error);

    res.status(500)  
  });




});




//without captcha
app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
    console.log(`Sender ${user.name}`);
   
    res.status(200).send(info);    
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
   
    auth: {
  
      user: details.email,
      pass: details.password
    }
  });

  let  mailOptions = {
    from:  user.name +" - "+ user.emailFrom, // sender address
    cc: user.emailFrom,
    to: user.emailTo, // list of receivers
    subject: user.subject, // Subject line
    html: `  
    <a>********DO NOT REPLY,web site generated Mail. Please use the customer email address to reply.********</a>
    <h4>Customer Name: ${user.name}</h4>    
    <p>Customer Email:${user.emailFrom}</p>
    <br>
    <p>${user.message}</p>`

  };

  // send mail with defined transport object  
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

// main().catch(console.error);
