/* global Entidade, SemMovimento, ComMovimento, Projetil, game */

module.exports = function(idDaSala, idNoUniverso, x, y, destinoX, destinoY)
{
    game.abstrato.Projetil.apply(this);
    game.abstrato.Entidade.apply(this, [idDaSala, idNoUniverso, x, y, 'brown', 'circle', 4]);
    game.abstrato.ComMovimento.apply(this, ['destinoIndefinido', 60]);
    
    this.escolherDestino(destinoX, destinoY);
};