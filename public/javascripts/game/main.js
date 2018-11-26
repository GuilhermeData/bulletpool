/* global Core, Rendererizador */

/** Inicializando o gameClient
 * Todas as salas de jogos vão iniciar com esse arquivo, todos os otros includes dependem desse para 
 * construir os jogos propriamente ditos, todos com base nesse formato e tudo dentro da const gc "gameClient"
 */

function GameClient()
{
    Core.apply(this);
    Rendererizador.apply(this);
}

const gc = new GameClient();