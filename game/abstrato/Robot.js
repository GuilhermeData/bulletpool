/* global Entidade, ComMovimento, game */

module.exports = function(idDaSala, idNoUniverso, x, y, color, tipoDeMovimento)
{
    game.abstrato.Entidade.apply(this, [idDaSala, idNoUniverso, x, y, color, 'circle']);
    game.abstrato.ComMovimento.apply(this, [tipoDeMovimento]);
};