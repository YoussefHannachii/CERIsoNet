const MongoClient = require("mongodb").MongoClient;
const mongoConnectPromise = MongoClient.connect('mongodb://127.0.0.1:27017/db-CER');
const moment = require('moment');

// Fonction pour trouver tout les messages
exports.getMessages = async (req,res) => {
    mongoConnectPromise
    .then(async(mongoBase) =>{
        if(mongoBase) { 
            const results = {};
            try {
                results.messages = await mongoBase.db().collection('messages').find().toArray();
                res.json(results);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }      
    }
});
}
// Fonction pour trier avec le plus anciens
exports.getMessagesByDateAsc = async (req,res) => {
    console.log(req.params.choix);
    const param  = req.params.choix;

    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        const results = {};
        try {
                results.messages = await mongoBase.db().collection('messages').find({}).toArray();
                results.messages.forEach(result => {
                    const combinedDate = new Date(`${result.date}T${result.hour}:00`);
                    result.combinedDate = combinedDate;
                });
                //Ordre croissant
                results.messages.sort((a, b) => a.combinedDate - b.combinedDate);
                res.json(results);
        }
        catch(err){
            res.json(err);
        }
    }
    })   
}
// Fonction pour trier avec le plus récents
exports.getMessagesByDateDesc = async (req,res) => {

    const param  = req.params.choix;

    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        const results = {};
        try {
                results.messages = await mongoBase.db().collection('messages').find({}).toArray();
                results.messages.forEach(result => {
                    const combinedDate = new Date(`${result.date}T${result.hour}:00`);
                    result.combinedDate = combinedDate;
                });
                //Ordre décroissant
                results.messages.sort((a, b) => (a.combinedDate - b.combinedDate) * -1);
                res.json(results);
        }
        catch(err){
            res.json(err);
        }
    }
    })   
}
// Fonction pour trier par like ascandant
exports.getMessagesByLikesAsc = async (req,res) => {
    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        const results = {};
        try {
            results.messages = await mongoBase.db().collection('messages').find({}).sort({likes:1}).toArray();
            res.json(results);
        }
        catch(err){
            res.json(err);
        }
    }})
}

// Fonction pour trier avec like descandant
exports.getMessagesByLikesDesc = async (req,res) => {
    
    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        const results = {};
        try {
            results.messages = await mongoBase.db().collection('messages').find({}).sort({likes:-1}).toArray();
            res.json(results);
        }
        catch(err){
            res.json(err);
        }
    }})
}
// Fonction pour trouver un message d'un utilisateur
exports.getMessagesOfSomeone = async (req,res) => {
    const ownersNumber = parseInt(req.params.id);
    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        try {
            const results ={};
            results.messages = await mongoBase.db().collection('messages').find({createdBy:ownersNumber}).toArray();
            res.json(results);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
        }
    })   
};
// Fonction pour filtrer avec hashtag
exports.getMessagesOfHashtag = async (req,res) => {
    const hashtag = req.params.hashtag;
    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        try {
            const results ={};
            results.messages = await mongoBase.db().collection('messages').find({hashtags: { $in: ['#'+hashtag] }}).toArray();
            res.json(results);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
        }
    })
};
// Fonction pour partager un message
exports.shareMessage = async(req,res) => {
    const messageId = req.body.messageId;
    const userId = req.body.userId;
    const content = req.body.content;
    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        try {
            const messageOriginale = await mongoBase.db().collection('messages').findOne({_id:messageId});
            const dateActuelle = moment().format('DD-MM-YYYY');
            const heureActuelle = moment().format('HH:mm');
            const documentDuplique = {
                date: dateActuelle,
                hour: heureActuelle,
                body: content,
                createdBy: userId,
                images: messageOriginale.images,
                likes: 0,
                hashtags: messageOriginale.hashtags,
                shared: messageId,
                comments : [],
            };
            await mongoBase.db().collection('messages').insertOne(documentDuplique);
            res.status(200).json({ message: "message : "+messageId+" shared !" });
        }catch(err){
            console.log(err);
            res.status(500).json({ message: err.message })
        }
        }
    })
}
// Fonction pour ajouter un commentaire
exports.addComment = async (req,res) => {
    const messageId = req.body.messageId;
    const userId = req.body.userId;
    const content = req.body.content;
    mongoConnectPromise // traitement de la promesse
    .then(async(mongoBase) => {
    if(mongoBase) {
        try {
            const dateActuelle = moment().format('DD-MM-YYYY');
            const heureActuelle = moment().format('HH:mm');
            const nouveauCommentaire = {
                commentedBy: userId,
                text: content,
                date: dateActuelle,
                hour: heureActuelle,
            }
            results =  await mongoBase.db().collection('messages').updateOne({_id: messageId},{ $push: { comments: nouveauCommentaire }}); 
            res.status(200).json({ message: "comment added susccesfully to message : "+messageId });
            }catch(err){
                res.status(500).json({ message: err.message })
            }
    }
})
}
// Fonction pour liker un message
exports.likeMessage = async (req,res) => {
    const messageId = req.body.messageId;
    mongoConnectPromise // traitement de la promesse
        .then(async(mongoBase) => {
        if(mongoBase) {
            try {
            //results.totalCount = await Message.countDocuments();
            // Effectuer vos opérations MongoDB ici
            results = await mongoBase.db().collection('messages').updateOne({_id: messageId},{$inc: {likes:1}});
            res.status(200).json({ message: "message : "+messageId+" liké !" });
            }catch(err){
                res.status(500).json({ message: err.message })
            }
        }
        }
    )    
}
 
// Fonction pour disliker un message
exports.dislikeMessage = async (req,res) => {
    const messageId = req.body.messageId;
    mongoConnectPromise // traitement de la promesse
        .then(async(mongoBase) => {
        if(mongoBase) {
            try {
            results = await mongoBase.db().collection('messages').updateOne({_id: messageId},{$inc: {likes: -1}});
            res.status(200).json({ message: "message : "+messageId+" disliké !" });
            }catch(err){
                res.status(500).json({ message: err.message })
            }
        }
        }
    )    
}
