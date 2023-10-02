const express = require('express');
//const mongoose = require('mongoose');
//const { Client } = require('pg');

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'), 
  cert: fs.readFileSync('cert.pem')
  };

const app = express();
const port =3173; // Utilisez un port de votre choix

const bodyParser= require('body-parser'); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json({limit: '10mb'}));

app.get('/login',(request,response)=>{
  
  response.sendFile(__dirname+'/public.html');
  console.log("still listening");
});

app.post('/login', (request, response) => {
  
  var username = request.body.email; 
  var password = request.body.password; 
  console.log(JSON.stringify(request.body));
  });

//console.log(__dirname);

// Démarrez le serveur Express
const server = https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS écoute sur le port ${port}`);
});


