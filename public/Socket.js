/**
 * Created by adubois on 08/12/15.
 */
var socket = io.connect('127.0.0.1:3000');

var idconnexion = 0;
var idGame = 0;

socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('match', function(data) {
    idconnexion = data;
    // alert( "Votre ID :"+idconnexion);
});

/* socket.on("howdy", function (data) {
    alert(data);
}); */



