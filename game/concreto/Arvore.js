/* global Entidade, SemMovimento, game */

module.exports = function(idDaSala, idNoUniverso, x, y)
{
    game.abstrato.Entidade.apply(this, [idDaSala, idNoUniverso, x, y, '#006600', 'arvore']);
    game.abstrato.SemMovimento.apply(this);
};