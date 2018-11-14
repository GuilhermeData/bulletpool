/* global game */

module.exports = {
    
    floresta: function(idDaSala, universo) {

        game.abstrato.MapaPequeno.apply(this);
        
        /**
         * Inicialização. 
         * Florestas têm árvores.
         */
        (function(_this, _universo) {

            let x = -1;
            while(++x < 0) {

                let novoID = game.utilidades.idAleatorio(15);

                // Se ainda não existe nada com esse mesmo id
                if(!_universo.estatico[novoID]) {

                    _universo.estatico[novoID] = new game.concreto.Arvore(
                        idDaSala,
                        novoID, 
                        game.utilidades.numeroAleatorio(60, _this.width - 60), 
                        game.utilidades.numeroAleatorio(60, _this.height - 60)
                    );
                }
            }
        })(this, universo);
    }
};