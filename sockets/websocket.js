const socketIO = require('socket.io');

function configureWebSocket(server) {
    const io = socketIO(server);
    const connectedUsers = new Set();

    io.on('connection', (socket) => {
        console.log('Nouvelle connexion WebSocket :', socket.id);

        // Ajouter l'utilisateur à la liste des connectés
        connectedUsers.add(socket.id);

        // Événement pour informer les utilisateurs, sauf l'utilisateur actuel
        socket.broadcast.emit('nouvelleConnexion', { userId: socket.id });

        socket.on('loginReussi', (data) => {
            // Émettez un événement pour informer tous les autres utilisateurs du login réussi
            console.log('login Réussi :' + data.username);
            socket.broadcast.emit('loginReussi', { userId: socket.id, username: data.username });
        });

        socket.on('deconnexionReussi', (data) => {
            socket.broadcast.emit('deconnexionReussi', { userId: socket.id, username: data.username });
        })

        socket.on('likeUtilisateur', (data) => {
            socket.broadcast.emit('likeUtilisateur', { userId: socket.id, username: data.username });
        })

        socket.on('disconnect', () => {
            console.log('Déconnexion WebSocket :', socket.id);
    
            // Retirez l'utilisateur de la liste des connectés
            connectedUsers.delete(socket.id);
    
            // Informez les autres utilisateurs de la déconnexion
            socket.broadcast.emit('deconnexion', { userId: socket.id });
        });
        
    });

    return io;
}

module.exports = configureWebSocket;
