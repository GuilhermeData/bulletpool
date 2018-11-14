/* global Entidade, SemMovimento, ComMovimento, Projetil, game */

module.exports = function(atirador, idNoUniverso, destinoX, destinoY, coicear)
{
    game.abstrato.Projetil.apply(this);
    game.abstrato.Entidade.apply(this, [
        atirador.idDaSala,
        idNoUniverso,
        atirador.posicaoX, 
        atirador.posicaoY, 
        '#FFF', 
        'circle', 
        4]);
    game.abstrato.ComMovimento.apply(this, ['destinoIndefinido', 60]);
    
    let preparacaoParaOCoice = this.escolherDestino(destinoX, destinoY, 'shotgun');
    
    if(coicear) {
        atirador.forcarAtualizacaoDePosicao(preparacaoParaOCoice);
    }
};