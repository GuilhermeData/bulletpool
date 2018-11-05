/**
 * Retornando a função que configura a conexão de um novo player
 */
module.exports = function(io) {
    
    /**
     * Simples like that
     * 
     * io.on('connection', function(socket){
     *   socket.emit('request', ); // emit an event to the socket
     *   io.emit('broadcast', ); // emit an event to all connected sockets
     *   socket.on('reply', function(){ }); // listen to the event
     * });
     * 
     */

    io.on('connection', function(socket){
        
        /**
         * Aqui temos a global: game
         */
        socket.on('disconnect', function () {
            
            let idDaSala = game.idSalaDoPlayer[socket.id];
            let complementoDaMensagem = '';
            
            if(idDaSala) {
                let salaDoPlayer = game.salas[idDaSala];
                let idDoPlayer = socket.id;

                salaDoPlayer.desconectarPlayer(idDoPlayer);
                complementoDaMensagem = ' da ' + idDaSala;
            }
            
            console.log('O jogador de ID ' + socket.id + ' saiu' + complementoDaMensagem);
        });
        
        for(let idDaSala in game.salas) {
            
            let sala = game.salas[idDaSala];
            
            socket.on(idDaSala, function(){
                
                let numeroAtualDePlayers = Object.keys(sala.players).length;

                if(numeroAtualDePlayers < sala.numeroMaximoDePlayers) {
                    
                    sala.conectarPlayer(socket);

                    socket.emit('conexaoAceita');

                    console.log('Jogador conectado na ' + idDaSala + ' com ID: ' + socket.id);

                } else {

                    console.log('Tentativa de conexão rejeitada na ' + idDaSala + ' para o ID: ' + socket.id);

                    socket.emit('conexaoRejeitada');

                    socket.disconnect();
                }

            });
        }
    });
};