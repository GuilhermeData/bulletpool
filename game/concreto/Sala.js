/* global game */

/**
 * Aqui criamos uma sala, ou seja, um UNIVERSO do jogo totalmente independente dos outros
 */

module.exports = function(idDaSala, numeroMaximoDePlayers, nomeDoMapa) {
    
    /**
     * Vamos iniciar o cenário e todos os seus objetos
     */
    
    var desenharUniversoPelaPrimeiraVez = false;
    
    this.idDaSala = idDaSala;
    this.numeroMaximoDePlayers = numeroMaximoDePlayers;
    this.players = {};
    this.sockets = {};
    this.universo = {
        dinamico: {},
        estatico: {}
    };
    this.loop = null;
    this.mapa = new game.concreto.Mapa[nomeDoMapa](idDaSala, this.universo);
    
    this.conectarPlayer = function(socket) {
        
        let idDoPlayer = socket.id;
        
        this.players[idDoPlayer] = new game.concreto.PlayerRobot(this.idDaSala, idDoPlayer, 50, 50, '#FFF');
        
        this.sockets[idDoPlayer] = socket;
        
        this.universo.dinamico[idDoPlayer] = this.players[idDoPlayer];
        
        game.idSalaDoPlayer[idDoPlayer] = this.idDaSala;
        
        // gerenciador de comandos do lado do servidor
        // cada sala pode ter um jogo diferente, então os comandos são configurados dentro da sala.
        require('../configurarComandos')(socket, this.players[idDoPlayer]);
        
        // Assim que o player é conectado, enviar os dados estaticos pra ele
        let dadosEstaticos = {
            remover: {},
            criar: this.universo.estatico,
            atualizar: {}
        };
        let dadosDePlayer = {
            player: this.players[idDoPlayer],
            mapa: this.mapa
        };
        socket.on('prontoParaReceberDados', function(){
            socket.emit('dadosDePlayer', dadosDePlayer);
            socket.emit('atualizarUmTick', dadosEstaticos);
            desenharUniversoPelaPrimeiraVez = true;
        });
    };
    
    this.desconectarPlayer = function(idDoPlayer) {
        
        if(this.players[idDoPlayer]) {
      
            delete this.universo.dinamico[idDoPlayer];

            delete this.players[idDoPlayer];

            delete this.sockets[idDoPlayer];
            
            delete game.idSalaDoPlayer[idDoPlayer];
        }
    };
    
    /**
     * Inicialização do loop de envio de dados para os clientes
     */
    (function(_this){
        
        // Cada iteração é um tick do game
        _this.loop = setInterval(function(){
            
            let dados = {
                criar: {},
                remover: {},
                atualizar: {}
            };

            if(desenharUniversoPelaPrimeiraVez) {
                
                // O universo vai deixar de ser atualizado nesse tick, para poder ser redesenhado
                dados.criar = _this.universo.dinamico;
                desenharUniversoPelaPrimeiraVez = false;
            
            } else {
                
                for(let id in _this.universo.dinamico) {

                    let pacoteDeDadosParaAtualizacao = _this.universo.dinamico[id].autoAtualizarUmTick();

                    /*
                     * Se algum ID for sobreescrito não há problema, a última iteração
                     * determina o estado final que é, justamente, aquele que deve ser enviado
                     * ao cliente para ser desenhado.
                     */

                    // REMOVER COISAS
                    for(let idFinal in pacoteDeDadosParaAtualizacao.remover) {
                        dados.remover[idFinal] = pacoteDeDadosParaAtualizacao.remover[idFinal];
                    }

                    // CRIAR COISAS
                    for(let idFinal in pacoteDeDadosParaAtualizacao.criar) {
                        dados.criar[idFinal] = pacoteDeDadosParaAtualizacao.criar[idFinal];
                    }

                    // ATUALIZAR O QUE SOBROU DE COISAS
                    for(let idFinal in pacoteDeDadosParaAtualizacao.atualizar) {
                        dados.atualizar[idFinal] = pacoteDeDadosParaAtualizacao.atualizar[idFinal];
                    }
                }
            }
            
            for(let id in _this.sockets) {
                _this.sockets[id].emit('atualizarUmTick', dados);
            }
            
        },1000/60);
        
    })(this);
    
};