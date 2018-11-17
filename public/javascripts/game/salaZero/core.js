/* global gc, createjs */

/** Tudo aqui diz respeito ao universo de jogo da salaZero, portanto pode ser tudo bem diferente
 * das outras salas, para cada uma delas um arquivo de construção do "core" deve ser criado 
 * para que as funções sejam adequadas àquele respectivo game e suas regras
 */

function iniciarImagensSalaZero() {
    
    //#todo Isso só funcionou para o background do mapa quando eu carreguei no iniciarConexão
    gc.images.imagemDoMapa = new Image();
    gc.images.imagemDoMapa.src = "images/tile-simple.png"; 
    // Preciso entender isso depois
}

gc.core.configurarComandos = function() {
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
        gc.socket.emit('mouseRightClick', {
           x: e.offsetX,
           y: e.offsetY
        });
    });

    document.addEventListener('click', function(e){
        e.preventDefault();
        //console.log((e.offsetX + stage.regX) + ' - ' + (e.offsetY + stage.regY));
        //console.log(universo[player.idNoUniverso].x +' - '+universo[player.idNoUniverso].y);
        gc.socket.emit('mouseLeftClick', {
           x: e.offsetX + gc.stage.regX,
           y: e.offsetY + gc.stage.regY
        });
    });

    document.addEventListener('keydown', function(e){
        if(chaves[e.keyCode] !== undefined) {
            if(!chaves[e.keyCode]) {
                chaves[e.keyCode] = true;
                gc.socket.emit('keyDown', e.keyCode);
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
                gc.socket.emit('keyUp', e.keyCode);
            }
        }
    });
};

gc.core.atualizarCamera = function() {

    let x = gc.universo[gc.player.idNoUniverso].x - (gc.stage.canvas.width / 2);
    let maxX = gc.mapa.width - (gc.stage.canvas.width);
    gc.stage.regX = 
        x >= 0 ? (
            x > maxX ? maxX : x
        ) : 0;

    let y = gc.universo[gc.player.idNoUniverso].y - (gc.stage.canvas.height / 2);
    let maxY = gc.mapa.height - (gc.stage.canvas.height);
    gc.stage.regY =
        y >= 0 ? (
            y > maxY ? maxY : y 
        ) : 0;
};

gc.core.iniciarConexao = function() {
    
    iniciarImagensSalaZero();

    gc.stage = new createjs.Stage("gameCanvas");

    gc.socket = io();
    
    gc.socket.on('connect', function(){
        
        /** Prepara para receber as respostas
         */
        gc.socket.on('conexaoAceita', function(){
            gc.core.iniciarJogo();
        });

        gc.socket.on('conexaoRejeitada', function(){
            $('#areaDoJogo').html('<h1>Sala lotada :/</h1>');
        });
        /**/
        
        /** Então envia o sinal para que alguma das respostas possíveis venha
         */
        gc.socket.emit('salaZero');
    });
};

gc.core.prepararParaIniciarAnimacao = function() {

    /* Isso será testado a cada frame, até que seja true e mude a função do Ticker
     * Quando o player estiver setado e desenhado, e o mapa estiver setado, entramos aqui
     */
    if(gc.player.idNoUniverso 
            && gc.universo[gc.player.idNoUniverso] 
            && gc.mapa.idNoUniverso 
            && gc.universo[gc.mapa.idNoUniverso]) {

        // #todo isso não pode ficar aqui
        gc.stage.setChildIndex(gc.universo[gc.mapa.idNoUniverso], 0);

        createjs.Ticker.removeAllEventListeners("tick");
        createjs.Ticker.addEventListener("tick", gc.core.animar);
    }
};

gc.core.animar = function() {
    gc.core.atualizarCamera();
    gc.stage.update();
};

gc.core.iniciarJogo = function() {

    /* Começa a escutar o teclado e o mouse
     */
    gc.core.configurarComandos();

    /* Começa a escutar se o player e o mapa estão setados
     */
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", gc.core.prepararParaIniciarAnimacao);

    /* Começa a escutar se o server mandou os dados do player e do mapa
     */
    gc.socket.on('dadosDePlayer', function(dados) {
        gc.mapa = dados.mapa;
        gc.player = dados.player;
    });

    /* Escuta o pacote básico de dados do server, que tem a cada frame
     */
    gc.socket.on('atualizarUmTick', function(dados) {

        if(Object.keys(dados.remover).length > 0) {
            for(let id in dados.remover) {
                gc.stage.removeChild(gc.universo[id]);
                delete gc.universo[id];
            }
        }

        if(Object.keys(dados.criar).length > 0) {
            for(let id in dados.criar) {
                if(!gc.universo[id]) {
                    gc.universo[id] = gc.renderer.criarEntidade(dados.criar[id]);
                    gc.stage.addChild(gc.universo[id]);
                }
            }
        }

        if(Object.keys(dados.atualizar).length > 0) {
            for(let id in dados.atualizar) {
                if(gc.universo[id])
                    gc.renderer.atualizarEntidade(gc.universo[id], dados.atualizar[id]);
            }
        }

    });

    /* Informa o servidor que pode começar a mandar dados
     */
    gc.socket.emit('prontoParaReceberDados');
};