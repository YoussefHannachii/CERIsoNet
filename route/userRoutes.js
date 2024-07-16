const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');

// Route pour trouver un utilisateur
router.get('/one/:id',controller.getUserDataFromId);
// Route pour trouver tout les utilisateurs
router.get('/list',controller.getAllUsers);
// Route pour deconnexion
router.put('/deconnexion', controller.disconnectUser);

module.exports = router;