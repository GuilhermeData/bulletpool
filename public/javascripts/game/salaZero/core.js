/* global createjs */

/** Tudo aqui diz respeito ao universo de jogo da salaZero, portanto pode ser tudo bem diferente
 * das outras salas, para cada uma delas um arquivo de construção do "core" deve ser criado 
 * para que as funções sejam adequadas àquele respectivo game e suas regras
 */

function Core()
{   
    const _this = this;
    
    // coisas em geral
    this.helpers = {};
    
    // configurações
    this.config = {};
    
    // informações
    this.info = {};
    
    // coisas básicas e importantes
    this.socket = {};
    this.universo = {};
    this.mapa = {};
    this.player = {};
    
    this.iniciarConexao = function() {

        _this.prepararRenderizador();

        _this.socket = io();

        _this.socket.on('connect', function(){

            /** Prepara para receber as respostas
             */
            _this.socket.on('conexaoAceita', function(){
                iniciarJogo();
            });

            _this.socket.on('conexaoRejeitada', function(){
                $('#areaDoJogo').html('<h1>Sala lotada :/</h1>');
            });
            /**/

            /** Então envia o sinal para que alguma das respostas possíveis venha
             */
            _this.socket.emit('salaZero');
        });
    };

    function configurarComandos() {
        let chaves = {
            '65': false, // a
            '83' : false, // s
            '68': false, // d
            '87': false, // w
            '85': false // u
        };

        document.addEventListener('contextmenu', function(e){
            e.preventDefault();
            //console.log(e.offsetX +' - '+e.offsetY);
            //console.log(universo[player.idNoUniverso].x +' - '+universo[player.idNoUniverso].y);
            _this.socket.emit('mouseRightClick', {
               x: e.offsetX,
               y: e.offsetY
            });
        });

        document.addEventListener('click', function(e){
            e.preventDefault();
            //console.log((e.offsetX + stage.regX) + ' - ' + (e.offsetY + stage.regY));
            //console.log(universo[player.idNoUniverso].x +' - '+universo[player.idNoUniverso].y);
            _this.socket.emit('mouseLeftClick', {
               x: e.offsetX + _this.stage.regX,
               y: e.offsetY + _this.stage.regY
            });
        });

        document.addEventListener('keydown', function(e){
            if(chaves[e.keyCode] !== undefined) {
                if(!chaves[e.keyCode]) {
                    chaves[e.keyCode] = true;
                    _this.socket.emit('keyDown', e.keyCode);
                }
            }

            if(e.keyCode === 85) {
                console.log('85');
            }
        });

        document.addEventListener('keyup', function(e){
            if(chaves[e.keyCode] !== undefined) {
                if(chaves[e.keyCode]) {
                    chaves[e.keyCode] = false;
                    _this.socket.emit('keyUp', e.keyCode);
                }
            }
        });
    };

    function iniciarJogo() {

        /* Começa a escutar o teclado e o mouse
         */
        configurarComandos();

        /* Começa a escutar se o player e o mapa estão setados
         */
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", _this.prepararParaIniciarAnimacao);

        /* Começa a escutar se o server mandou os dados do player e do mapa
         */
        _this.socket.on('dadosDePlayer', function(dados) {
            _this.mapa = dados.mapa;
            _this.player = dados.player;
        });

        /* Escuta o pacote básico de dados do server, que tem a cada frame
         */
        _this.socket.on('atualizarUmTick', function(dados) {

            if(Object.keys(dados.remover).length > 0) {
                for(let id in dados.remover) {
                    _this.stage.removeChild(_this.universo[id]);
                    delete _this.universo[id];
                }
            }

            if(Object.keys(dados.criar).length > 0) {
                for(let id in dados.criar) {
                    if(!_this.universo[id]) {
                        _this.universo[id] = _this.criarEntidade(dados.criar[id]);
                        _this.stage.addChild(_this.universo[id]);
                    }
                }
            }

            if(Object.keys(dados.atualizar).length > 0) {
                for(let id in dados.atualizar) {
                    if(_this.universo[id])
                        _this.atualizarEntidade(_this.universo[id], dados.atualizar[id]);
                }
            }

        });

        /* Informa o servidor que pode começar a mandar dados
         */
        _this.socket.emit('prontoParaReceberDados');
    }
}