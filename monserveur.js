const express = require('express');
const mongoose = require('mongoose');
const messagesRoutes = require('./route/messagesRoutes');
const userRoutes = require('./route/userRoutes');
const http = require('http');
const configureWebSocket = require('./sockets/websocket');

//module du crypthage pour le mdp
const crypto = require('crypto');

//recharge le module https et fs 
const https = require('https');
const fs = require('fs');

//middleware postgesql
const pgClient = require('pg');

const cors = require('cors');

//Les paramétres du certificat https que j'ai crée
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

const app = express();
const port =3173; // mon port sur le serveur node

const session = require('express-session');
const MongoClient = require("mongodb").MongoClient;

const dsnMongoDB = "mongodb://127.0.0.1:27017/new_york";
  
const MongoDBStore = require('connect-mongodb-session')(session);
// Création du store
const store = new MongoDBStore({
  uri: dsnMongoDB,
  collection: 'mySessions3173',
  touchAfter: 24 * 3600,
});

const corsOptions = {
  origin: "http://localhost:4200/",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));
// Configuration de la session
app.use(session({
  secret: 'anfoi7zg8ergio',
  saveUninitialized: false,
  resave: false,
  store,
  cookie: { maxAge: 24 * 3600 * 1000 }, // Valeur par défaut en millisecondes
}));


const bodyParser= require('body-parser'); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json({limit: '10mb'}));

//pour travailler avec le build du projet angular
app.use(express.static('/nfs/data01/data/uapv24/uapv2400430/CERISoNet/front_end/CERIsoNet/dist/ceriso-net-front/'));

//La méthide pour le login
app.post('/login', (request, response) => {
  
  sql ="Select * from fredouil.users where identifiant ='"+request.body.username+"';";

  //objet de hachage sha1 et le cryptage du passord du formulaire 
  const sha1Hash = crypto.createHash('sha1');
  sha1Hash.update(request.body.password);
  const passwordHached = sha1Hash.digest('hex');

  const connectionObj = new pgClient.Pool({user: 'uapv2400430', host: '127.0.0.1',database: 'etd', password: 'Wm8NMR', port: 5432 });

  connectionObj.connect((err, client, done) => {
    if(err){
      //traitement de cas d'erreur de connexion à la base postgrées
      console.log('Error connecting to pg server' + err.stack);
    }
    else{
      //traitement lors d'une connexion réussite à la base
      console.log("connexion base bonne ");
      client.query(sql,(err,result)=>{
              //traitement cas erreur de la requete
            if(err){
                console.log('Erreur d’exécution de la requete' + err.stack);
                //response.status='Connexion échouée'; 
            }

              //traitement si les données du formulaire sont correctes 
            else if((result.rows[0] != null) && (result.rows[0].motpasse == passwordHached)){

              const mongoConnectPromise = MongoClient.connect(dsnMongoDB);
              mongoConnectPromise // traitement de la promesse
              .then((mongoBase) => {
              //console.log(mongoBase); // Affichage de l’objet de connexion
              if(mongoBase) { 
                return mongoBase.db().collection('mySessions3173').find({}, { sort: { expires: -1} }).toArray();
              }
              }).then((data)=>{
                      sqlForUpdateStatut ="Update fredouil.users set statut_connexion = 1 where identifiant ='"+request.body.username+"';";
                      client.query(sqlForUpdateStatut,(err,result)=>{
                        //traitement cas erreur de la requete
                      if(err){
                          console.log('Erreur d’exécution de la requete' + err.stack);
                      }else{
                        console.log("updatetd statut connexion to 1");
                      }});
                      //Connexion réussie
                      const lastLogin=data[0].session.lastLogin;
                      const id=result.rows[0].id;
                      request.session.isConnected= true; // utilisation des sessions
                      request.session.username=result.rows[0].identifiant;
                      request.session.lastLogin= new Date();
                      const responseData = {
                          id : id,
                          lastLoginDate : lastLogin,
                          isConnected : request.session.isConnected,
                          username : request.session.username, 
                      } 
             
              response.status(200).json(responseData);
              }) 
            }
            else{
              response.status(400).json('Connexion échouée : informations de connexionincorrecte');
            }
      });
      client.release();
      }
    });
  });

  app.use('/api/messages', messagesRoutes);
  app.use('/api/user',userRoutes);

// Démarrez le serveur Express
const server = https.createServer(credentials, app).listen(port, () => {
  console.log(`HTTPS écoute sur le port ${port}`);
});
// Configuration des websockets 
const io = configureWebSocket(server);