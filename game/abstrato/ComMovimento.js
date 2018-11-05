/* global game */

module.exports = function(tipoDeMovimento, velocidade = 2)
{
    this.moverPor = tipoDeMovimento;
    this.velocidade = velocidade;
    
    this.destinoX = 0;
    this.destinoY = 0;
    
    this.direcaoX = 1;
    this.direcaoY = 1;
    
    this.unidadeDeMovimentoX = 1;
    this.unidadeDeMovimentoY = 1;
    
    this.moverPara = {
        '65': false, // a
        '83' : false, // s
        '68': false, // d
        '87': false // w
    };
    
    this.acionarMovimento = function(cod) {
        this.moverPara[cod] = true;
    };
    
    this.pararMovimento = function(cod) {
        this.moverPara[cod] = false;
    };
    
    this.atualizarPosicaoUmTick = function() {
        
        // #todo otimizar isso
        let limiteLarguraDoMapa = game.salas[this.idDaSala].mapa.width;
        let limiteAlturaDoMapa = game.salas[this.idDaSala].mapa.height;
        
        if(this.moverPor === 'setas') {
            
            if(this.moverPara[65]) {
                this.posicaoX -= this.unidadeDeMovimentoX * this.velocidade;
                this.posicaoX = this.posicaoX < 0 ? 0 : this.posicaoX;
            }

            if(this.moverPara[83]) {
                this.posicaoY += this.unidadeDeMovimentoY * this.velocidade;
                this.posicaoY = this.posicaoY > (limiteAlturaDoMapa) ? limiteAlturaDoMapa : this.posicaoY;
            }

            if(this.moverPara[68]) {
                this.posicaoX += this.unidadeDeMovimentoX * this.velocidade;
                this.posicaoX = this.posicaoX > (limiteLarguraDoMapa) ? limiteLarguraDoMapa : this.posicaoX;
            }

            if(this.moverPara[87]) {
                this.posicaoY -= this.unidadeDeMovimentoY * this.velocidade;
                this.posicaoY = this.posicaoY < 0 ? 0 : this.posicaoY;
            }
            
        } else if(this.moverPor === 'destino') {
        
            if(this.destinoX > this.posicaoX) {
                this.posicaoX += this.unidadeDeMovimentoX * this.velocidade;
                if(this.destinoX < this.posicaoX) {
                    this.posicaoX = this.destinoX;
                }
            }

            if(this.destinoX < this.posicaoX) {
                this.posicaoX -= this.unidadeDeMovimentoX * this.velocidade;
                if(this.destinoX > this.posicaoX) {
                    this.posicaoX = this.destinoX;
                }
            }

            if(this.destinoY > this.posicaoY) {
                this.posicaoY += this.unidadeDeMovimentoY * this.velocidade;
                if(this.destinoY < this.posicaoY) {
                    this.posicaoY = this.destinoY;
                }
            }

            if(this.destinoY < this.posicaoY) {
                this.posicaoY -= this.unidadeDeMovimentoY * this.velocidade;
                if(this.destinoY > this.posicaoY) {
                    this.posicaoY = this.destinoY;
                }
            }
            
        } else if(this.moverPor === 'destinoIndefinido') {
            
            // #todo otimizar isso
            let limiteLarguraDoMapa = game.salas[this.idDaSala].mapa.width;
            let limiteAlturaDoMapa = game.salas[this.idDaSala].mapa.height;
            
            let times = this.velocidade;
            
            while(--times > 0) {
                this.posicaoX += (this.unidadeDeMovimentoX) * this.direcaoX;
                this.posicaoY += (this.unidadeDeMovimentoY) * this.direcaoY;
                if(this.posicaoX > limiteLarguraDoMapa || this.posicaoX < 0) {
                    this.autoDestruir = true;
                }
                if(this.posicaoY > limiteAlturaDoMapa || this.posicaoY < 0) {
                    this.autoDestruir = true;
                }
            }
        }
    };
    
    this.escolherDestino = function(x, y, variacao) {
        
        let catetoA = Math.abs(x - this.posicaoX);
        let catetoB = Math.abs(y - this.posicaoY);
        let total =  catetoA + catetoB;
        
        this.unidadeDeMovimentoX = catetoA / total;
        this.unidadeDeMovimentoY = catetoB / total;
        
        if(variacao === 'shotgun') {
            this.unidadeDeMovimentoX += (game.utilidades.numeroAleatorio(-0.1, 0.1, false));
            this.unidadeDeMovimentoY += (game.utilidades.numeroAleatorio(-0.1, 0.1, false));
        }
        
        this.destinoX = x;
        this.destinoY = y;
        
        if(this.destinoX > this.posicaoX) {
            this.direcaoX = 1;
        }

        if(this.destinoX < this.posicaoX) {
            this.direcaoX = -1;
        }

        if(this.destinoY > this.posicaoY) {
            this.direcaoY = 1;
        }

        if(this.destinoY < this.posicaoY) {
            this.direcaoY = -1;
        }
        
        return [this.unidadeDeMovimentoX, this.unidadeDeMovimentoY, this.direcaoX, this.direcaoY];
    };
    
    this.forcarAtualizacaoDePosicao = function(dados) {
        //console.log(dados);
    };
    
    /*
    this.atualizarPosicaoUmTick = function() {
        
        if(this.destinoX > this.posicaoX) {
            this.posicaoX += this.unidadeDeMovimentoX * this.velocidade;
            if(this.destinoX < this.posicaoX) {
                this.posicaoX = this.destinoX;
            }
        }
        
        if(this.destinoX < this.posicaoX) {
            this.posicaoX -= this.unidadeDeMovimentoX * this.velocidade;
            if(this.destinoX > this.posicaoX) {
                this.posicaoX = this.destinoX;
            }
        }
        
        if(this.destinoY > this.posicaoY) {
            this.posicaoY += this.unidadeDeMovimentoY * this.velocidade;
            if(this.destinoY < this.posicaoY) {
                this.posicaoY = this.destinoY;
            }
        }
        
        if(this.destinoY < this.posicaoY) {
            this.posicaoY -= this.unidadeDeMovimentoY * this.velocidade;
            if(this.destinoY > this.posicaoY) {
                this.posicaoY = this.destinoY;
            }
        }
    };
    */
};