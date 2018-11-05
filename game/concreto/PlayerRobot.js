/* global Robot, game */

module.exports = function(idDaSala, idNoUniverso, x, y, color)
{
    game.abstrato.Robot.apply(this, [idDaSala, idNoUniverso, x, y, color, 'setas']);
    
    this.indiceDaArmaSelecionada = 1;
    
    this.armas = [
        new game.concreto.Shotgun(),
        new game.concreto.Handgun()
    ];
    
    this.atirar = function(x, y) {
        this.armas[this.indiceDaArmaSelecionada].disparar(this, x, y);
    };
    
    this.trocarDeArma = function() {
        this.indiceDaArmaSelecionada = this.indiceDaArmaSelecionada ? 0 : 1;
    };
};