/**
 * Aqui vamos construir TODO o jogo no formato de um objeto que será
 * guardado na variavel global: game.
 */

game = {
    abstrato: {
        ComMovimento: require('./abstrato/ComMovimento'),
        Entidade: require('./abstrato/Entidade'),
        Gun: require('./abstrato/Gun'),
        Projetil: require('./abstrato/Projetil'),
        Robot: require('./abstrato/Robot'),
        SemMovimento: require('./abstrato/SemMovimento'),
        
        MapaPequeno: require('./abstrato/MapaPequeno')
    },
    
    concreto: {
        Arvore: require('./concreto/Arvore'),
        GunProjetil: require('./concreto/GunProjetil'),
        Handgun: require('./concreto/Handgun'),
        PlayerRobot: require('./concreto/PlayerRobot'),
        Shotgun: require('./concreto/Shotgun'),
        ShotgunProjetil: require('./concreto/ShotgunProjetil'),
        
        Mapa: require('./concreto/Mapa')
    },
    
    utilidades: require('./utilidades'),
    
    // Para facilitar a vida no arquivo configurarConexao
    idSalaDoPlayer: {}
};

let Sala = require('./concreto/Sala');

/**
 * Sala:
 *  arg1: id da sala
 *  arg2: número maximo de jogadores
 *  arg3: nome do mapa
 */
game.salas = {
    salaZero: new Sala('salaZero', 2, 'floresta'), 
    salaUm: new Sala('salaUm', 0, 'floresta'), 
    salaDois: new Sala('salaDois', 0, 'floresta'), 
    salaTres: new Sala('salaTres', 0, 'floresta'), 
    salaQuatro: new Sala('salaQuatro', 0, 'floresta')
};