module.exports = {
    
    numeroAleatorio: function(min = 0, max = 1, arredondar = true) {
        let numero = Math.random() * (max - min) + min;
        return arredondar ? Math.floor(numero) : numero;
    },
    
    idAleatorio: function(numeroDeCaracteres) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < numeroDeCaracteres; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
};