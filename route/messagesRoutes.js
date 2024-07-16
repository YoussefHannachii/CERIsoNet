const express = require('express');
const router = express.Router();
const controller = require('../controller/messagesController');

// Route pour trouver tout les listes
router.get('/list',controller.getMessages);
// Route pour trouver un message d'un utiisateur
router.get('/user/:id',controller.getMessagesOfSomeone);
// Route pour trier moins likés 
router.get('/likesOrderUp',controller.getMessagesByLikesAsc);
// Route pour trier plus likés
router.get('/likesOrderDown',controller.getMessagesByLikesDesc);
// Route pour trier plus ancien
router.get('/dateOrderUp',controller.getMessagesByDateAsc);
// Route pour trier plus récents
router.get('/dateOrderDown',controller.getMessagesByDateDesc);
// Route pour filtrer avec hashtag
router.get('/tag/:hashtag',controller.getMessagesOfHashtag);
// Route pour liker
router.put('/like',controller.likeMessage);
// Route pour disliker
router.put('/dislike',controller.dislikeMessage);
// Route pour partager
router.post('/share',controller.shareMessage);
// Route pour commenter 
router.put('/comment',controller.addComment);


module.exports = router;