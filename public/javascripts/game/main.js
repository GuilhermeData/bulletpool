/* global createjs */

function iniciarConexao() {
    
    
    //#todo Isso só funcionou para o background do mapa quando eu carreguei aqui 
    var imagemDoMapa = new Image();
    imagemDoMapa.src = "images/tile-simple.png"; 
    // Preciso entender isso depois

    const stage = new createjs.Stage("gameCanvas");

    const socket = io();
    
    const universo = {};
    
    var mapa = {};
    
    var player = {};
    
    socket.on('connect', function(){
        
        /** Prepara para receber as respostas
         */
        socket.on('conexaoAceita', function(){
            iniciarJogo();
        });

        socket.on('conexaoRejeitada', function(){
            $('#areaDoJogo').html('<h1>Sala lotada :/</h1>');
        });
        /**/
        
        /** Então envia o sinal para que alguma das respostas possíveis venha
         */
        socket.emit('salaZero');
    });
    
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
            socket.emit('mouseRightClick', {
               x: e.offsetX,
               y: e.offsetY
            });
        });

        document.addEventListener('click', function(e){
            e.preventDefault();
            //console.log((e.offsetX + stage.regX) + ' - ' + (e.offsetY + stage.regY));
            //console.log(universo[player.idNoUniverso].x +' - '+universo[player.idNoUniverso].y);
            socket.emit('mouseLeftClick', {
               x: e.offsetX + stage.regX,
               y: e.offsetY + stage.regY
            });
        });

        document.addEventListener('keydown', function(e){
            if(chaves[e.keyCode] !== undefined) {
                if(!chaves[e.keyCode]) {
                    chaves[e.keyCode] = true;
                    socket.emit('keyDown', e.keyCode);
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
                    socket.emit('keyUp', e.keyCode);
                }
            }
        });
    }


    function atualizarCamera() {
        
        let x = universo[player.idNoUniverso].x - (stage.canvas.width / 2);
        let maxX = mapa.width - (stage.canvas.width);
        stage.regX = 
            x >= 0 ? (
                x > maxX ? maxX : x
            ) : 0;
    
        let y = universo[player.idNoUniverso].y - (stage.canvas.height / 2);
        let maxY = mapa.height - (stage.canvas.height);
        stage.regY =
            y >= 0 ? (
                y > maxY ? maxY : y 
            ) : 0;
    }
    
    
    function criarMapa(dadosDaEntidade) {
        
        // #todo ISSO É TEMPORÁRIO, depois eu vou achar um jeito de desenhar direito o mapa
        // usando a variável do mapa mesmo
        let shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(imagemDoMapa)
                .drawRect(0,0,dadosDaEntidade.width, dadosDaEntidade.height);
        return shape;
    }
    
    function criarPlayer(dadosDaEntidade) {
        var img = new Image();
        img.src = "images/robot.png";
        var bitmap = new createjs.Bitmap(img);
        bitmap.x = dadosDaEntidade.posicaoX;
        bitmap.y = dadosDaEntidade.posicaoY;
        return bitmap;
    }
    
    function criarCirculo(dadosDaEntidade) {
        let circle = new createjs.Shape();
        circle.graphics.beginFill(dadosDaEntidade.renderizar.cor).drawCircle(0, 0, dadosDaEntidade.renderizar.tamanho);
        circle.x = dadosDaEntidade.posicaoX;
        circle.y = dadosDaEntidade.posicaoY;
        return circle;
    }

    // #todo aperfeiçoar
    function criarEntidade(dadosDaEntidade) {
        if(dadosDaEntidade.renderizar.tamanho > 8 && dadosDaEntidade.renderizar.tamanho < 1000) {
            return criarPlayer(dadosDaEntidade);
        } else if(dadosDaEntidade.renderizar.tamanho > 1000) {
            return criarMapa(dadosDaEntidade);
        } else return criarCirculo(dadosDaEntidade);
    }
    
    // #todo aperfeiçoar
    function atualizarEntidade(entidade, dadosNovos) {
        // #todo depois isso vai muito além de mudar de posicao
        entidade.x = dadosNovos.posicaoX;
        entidade.y = dadosNovos.posicaoY;
    }
    
    function prepararParaIniciarAnimacao() {
        
        /* Isso será testado a cada frame, até que seja true e mude a função do Ticker
         * Quando o player estiver setado e desenhado, e o mapa estiver setado, entramos aqui
         */
        if(player.idNoUniverso 
                && universo[player.idNoUniverso] 
                && mapa.idNoUniverso 
                && universo[mapa.idNoUniverso]) {
            
            // #todo isso não pode ficar aqui
            stage.setChildIndex(universo[mapa.idNoUniverso], 0);
            
            createjs.Ticker.removeAllEventListeners("tick");
            createjs.Ticker.addEventListener("tick", animar);
        }
    }
    
    function animar() {
        atualizarCamera();
        stage.update();
    }

    function iniciarJogo() {
        
        /* Começa a escutar o teclado e o mouse
         */
        configurarComandos();
        
        /* Começa a escutar se o player e o mapa estão setados
         */
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", prepararParaIniciarAnimacao);
        
        /* Começa a escutar se o server mandou os dados do player e do mapa
         */
        socket.on('dadosDePlayer', function(dados) {
            mapa = dados.mapa;
            player = dados.player;
        });

        /* Escuta o pacote básico de dados do server, que tem a cada frame
         */
        socket.on('atualizarUmTick', function(dados) {

            if(Object.keys(dados.remover).length > 0) {
                for(let id in dados.remover) {
                    stage.removeChild(universo[id]);
                    delete universo[id];
                }
            }

            if(Object.keys(dados.criar).length > 0) {
                for(let id in dados.criar) {
                    if(!universo[id]) {
                        universo[id] = criarEntidade(dados.criar[id]);
                        stage.addChild(universo[id]);
                    }
                }
            }

            if(Object.keys(dados.atualizar).length > 0) {
                for(let id in dados.atualizar) {
                    if(universo[id])
                        atualizarEntidade(universo[id], dados.atualizar[id]);
                }
            }

        });
        
        /* Informa o servidor que pode começar a mandar dados
         */
        socket.emit('prontoParaReceberDados');
    }
};