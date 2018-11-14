module.exports = function(
    idDaSala = '', 
    idNoUniverso = '', 
    x = 0, 
    y = 0, 
    corDeRenderizacao = '#FFF', 
    temaDeRenderizacao = 'circle', 
    tamanhoDeRenderizacao = 12
) {
    
    this.idDaSala = idDaSala;
    this.idNoUniverso = idNoUniverso;
    this.posicaoX = x;
    this.posicaoY = y;
    this.jaFoiRenderizado = false;
    this.renderizar = {
        cor: corDeRenderizacao,
        tema: temaDeRenderizacao,
        tamanho: tamanhoDeRenderizacao
    };
    
    this.autoAtualizarUmTick = function() {
        
        /**
         * Deve mandar algo como 
         * {
         *  remover: {},
         *  criar: {},
         *  atualizar: {}
         * }
         */
        
        
        if(this.atualizarPosicaoUmTick) {
            this.atualizarPosicaoUmTick();
        }
        if(this.autoDestruir) {
            return {
                remover: {
                    [this.idNoUniverso]: true
                },
                criar: {},
                atualizar: {}
            };
        } else {
            
            if(!this.jaFoiRenderizado) {
                
                this.jaFoiRenderizado = true;
                
                return {
                    remover: {},
                    criar: {
                        [this.idNoUniverso]: this
                    },
                    atualizar: {}
                };
            } else {
                
                // #todo criar o teste para ver se realmente precisa atualizar
                return {
                    remover: {},
                    criar: {},
                    atualizar: {
                        [this.idNoUniverso]: this
                    }
                };
            }
        }
    };
    
};