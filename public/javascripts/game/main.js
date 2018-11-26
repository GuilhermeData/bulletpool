/** Inicializando o gameClient
 * Todas as salas de jogos vão iniciar com esse arquivo, todos os otros includes dependem desse para 
 * construir os jogos propriamente ditos, todos com base nesse formato e tudo dentro da const gc "gameClient"
 */
const gc = {
    
    // core
    core: {
        configurarComandos: {},
        atualizarCamera: {},
        prepararParaIniciarAnimacao: {},
        animar: {},
        iniciarConexao: {},
        iniciarJogo: {}
    },
    
    // coisas em geral
    helpers: {},
    
    // configurações
    config: {},
    
    // informações
    info: {},
    
    // imagens precisam ser pré-carregadas
    imagens: {},
    
    // sons também
    sons: {},
    
    // coisas de animação
    renderer: {},
    stage: {},
    
    // coisas básicas e importantes
    socket: {},
    universo: {},
    mapa: {},
    player: {}
};