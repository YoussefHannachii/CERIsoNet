const pgClient = require('pg');
const connectionObj = new pgClient.Pool({user: 'uapv2400430', host: '127.0.0.1',database: 'etd', password: 'Wm8NMR', port: 5432 });

//Fonction pour trouver 
exports.getUserDataFromId = async (req,res) => {
    
    sql = "select * from fredouil.users where id = "+req.params.id+";";
    console.log(sql);
    
    connectionObj.connect((err, client, done) => {
      if(err){
        //traitement de cas d'erreur de connexion à la base postgrées
        res.status(500).json({ message: err.message });
      }
      else{
        //traitement lors d'une connexion réussite à la base
        const response = {};
        client.query(sql,(err,result)=>{
        response.message.identifiant = result.rows[0].identifiant;
        response.message.avatarUrl = result.rows[0].avatar;
        response.message.isConnected=result.rows[0].statut_connexion;
        res.json(response);
        }
        )}
    });
};

//Fonction pour trouver tout les utilisateur
exports.getAllUsers = async (req,res) => {
    
    sql = "select * from fredouil.users ";
    
    connectionObj.connect((err, client, done) => {
      if(err){
        //traitement de cas d'erreur de connexion à la base postgrées
        res.status(500).json({ message: err.message });
      }
      else{
        //traitement lors d'une connexion réussite à la base
        const response = {};
        response.users = {};
        let cpt=0;
        client.query(sql,(err,result)=>{
            result.rows.forEach(element => {
            let row={};
            row.id = element.id;
             row.identifiant = element.identifiant;
            if(element.avatar){
                row.avatarUrl = element.avatar;
            }
            else{
                row.avatarUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AUser-avatar.svg&psig=AOvVaw2zeGLWE-TUG8CMrDPMryMm&ust=1701390472052000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCNCSgse76oIDFQAAAAAdAAAAABAE';
            }
            row.nom=element.nom;
            row.prenom=element.prenom;
            row.isConnected=element.statut_connexion;
            response.users[cpt]=row;
            cpt++;
            });
        response.nbrOfUsers=cpt;
        res.json(response);
        }
        )}
      });
};

//fonction pour deconnecter un utilisateur
exports.disconnectUser = async (req,res) => {
  sqlForUpdateStatut ="Update fredouil.users set statut_connexion = 0 where identifiant ='"+req.body.username+"';";
  connectionObj.connect((err, client, done) => {
    if(err){
      //traitement de cas d'erreur de connexion à la base postgrées
      console.log('Error connecting to pg server' + err.stack);
    }
    else{
      //traitement lors d'une connexion réussite à la base
      client.query(sqlForUpdateStatut,(err,result)=>{
        //traitement cas erreur de la requete
      if(err){
          res.status(500).json({ message: "Erreur lors de la mise à jour du statut de connexion" });
      } else {
        res.status(200).json({ message: "Mise à jour du statut de connexion réussie" });
      }
    })
  }
})
}