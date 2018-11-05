/* global Gun, game */

module.exports = function()
{
    game.abstrato.Gun.apply(this);
    
    // Toda arma deve ter esse metodo
    this.disparar = function(portador, destinoX, destinoY) {
        
        let novoID = game.utilidades.idAleatorio(15);

        // Se ainda não existe nada com esse mesmo id
        if(!game.salas[portador.idDaSala].universo.dinamico[novoID]) {
            
            game.salas[portador.idDaSala].universo.dinamico[novoID] = 
                    
                new game.concreto.GunProjetil(
                    portador.idDaSala,
                    novoID,
                    portador.posicaoX, 
                    portador.posicaoY, 
                    destinoX, 
                    destinoY);
        }
    };
};