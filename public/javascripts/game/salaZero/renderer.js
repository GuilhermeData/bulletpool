/* global gc, createjs */

/* Esse é o renderizador da salaZero e, apesar de usar elementos gerais do renderizador padrão,
 * pode acabar sendo diferente dos renderizadores das outras salas.
 */

function SalaZeroRenderer() {

    function criarMapa(dadosDaEntidade) {

        // #todo ISSO É TEMPORÁRIO, depois eu vou achar um jeito de desenhar direito o mapa
        // usando a variável do mapa mesmo
        let shape = new createjs.Shape();
        shape.graphics.beginBitmapFill(gc.imagens.imagemDoMapa)
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
}

gc.renderer = new SalaZeroRenderer();