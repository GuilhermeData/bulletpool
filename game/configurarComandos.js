module.exports = function(socket, player)
{
    socket.on('mouseRightClick', function(coordenadas){
        player.trocarDeArma();
    });
    
    socket.on('mouseLeftClick', function(coordenadas){
        player.atirar(coordenadas.x, coordenadas.y);
    });
    
    socket.on('keyDown', function(codigo){
        player.acionarMovimento(codigo);
    });
    
    socket.on('keyUp', function(codigo){
        player.pararMovimento(codigo);
    });
};