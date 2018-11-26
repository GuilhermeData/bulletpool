/* global createjs */

/* Esse é o renderizador da salaZero e, apesar de usar elementos gerais do renderizador padrão,
 * pode acabar sendo diferente dos renderizadores das outras salas.
 */

function Rendererizador() 
{
    const _this = this;
    
    this.stage = {};
    
    // imagens precisam ser pré-carregadas
    this.imagens = {};
    
    // sons também
    this.sons = {};
    
    this.prepararRenderizador = function() {
        
        iniciarImagensSalaZero();

        _this.stage = new createjs.Stage("gameCanvas");
    };
    
    this.prepararParaIniciarAnimacao = function() {

        /* Isso será testado a cada frame, até que seja true e mude a função do Ticker
         * Quando o player estiver setado e desenhado, e o mapa estiver setado, entramos aqui
         */
        if(_this.player.idNoUniverso 
                && _this.universo[_this.player.idNoUniverso] 
                && _this.mapa.idNoUniverso 
                && _this.universo[_this.mapa.idNoUniverso]) {

            // #todo isso não pode ficar aqui
            _this.stage.setChildIndex(_this.universo[_this.mapa.idNoUniverso], 0);

            createjs.Ticker.removeAllEventListeners("tick");
            createjs.Ticker.addEventListener("tick", animar);
        }
    };

    // #todo aperfeiçoar
    this.criarEntidade = function(dadosDaEntidade) {
        if(dadosDaEntidade.renderizar.tamanho > 8 && dadosDaEntidade.renderizar.tamanho < 1000) {
            return criarPlayer(dadosDaEntidade);
        } else if(dadosDaEntidade.renderizar.tamanho > 1000) {
            return criarMapa(dadosDaEntidade);
        } else return criarCirculo(dadosDaEntidade);
    };

    // #todo aperfeiçoar
    this.atualizarEntidade = function(entidade, dadosNovos) {
        // #todo depois isso vai muito além de mudar de posicao
        entidade.x = dadosNovos.posicaoX;
        entidade.y = dadosNovos.posicaoY;
    };
    
    function iniciarImagensSalaZero() {

        //#todo Isso só funcionou para o background do mapa quando eu carreguei no iniciarConexão
        _this.imagens.imagemDoMapa = new Image();
        _this.imagens.imagemDoMapa.src = "images/tile-simple.png"; 
        // Preciso entender isso depois
    }
    
    function atualizarCamera() {

        let x = _this.universo[_this.player.idNoUniverso].x - (_this.stage.canvas.width / 2);
        let maxX = _this.mapa.width - (_this.stage.canvas.width);
        _this.stage.regX = 
            x >= 0 ? (
                x > maxX ? maxX : x
            ) : 0;

        let y = _this.universo[_this.player.idNoUniverso].y - (_this.stage.canvas.height / 2);
        let maxY = _this.mapa.height - (_this.stage.canvas.height);
        _this.stage.regY =
            y >= 0 ? (
                y > maxY ? maxY : y 
            ) : 0;
    };
    
    function animar() {
        atualizarCamera();
        _this.stage.update();
    };

    function criarMapa(dadosDaEntidade) {

        // #todo ISSO É TEMPORÁRIO, depois eu vou achar um jeito de desenhar direito o mapa
        // usando a variável do mapa mesmo
        let shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(_this.imagens.imagemDoMapa)
                .drawRect(0,0,dadosDaEntidade.width, dadosDaEntidade.height);
        return shape;
    };

    function criarPlayer(dadosDaEntidade) {
        var img = new Image();
        img.src = "images/robot.png";
        var bitmap = new createjs.Bitmap(img);
        bitmap.x = dadosDaEntidade.posicaoX;
        bitmap.y = dadosDaEntidade.posicaoY;
        return bitmap;
    };

    function criarCirculo(dadosDaEntidade) {
        let circle = new createjs.Shape();
        circle.graphics.beginFill(dadosDaEntidade.renderizar.cor).drawCircle(0, 0, dadosDaEntidade.renderizar.tamanho);
        circle.x = dadosDaEntidade.posicaoX;
        circle.y = dadosDaEntidade.posicaoY;
        return circle;
    };
}