/**
 * Created by adubois on 08/12/15.
 */
var socket = io.connect('http://localhost:3000');
var idconnexion = 0;
socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});
socket.on('match', function(data) {
    idconnexion = data;
    alert( "Votre ID :"+idconnexion);
});

socket.on('messages', function(data) {
    alert(data.message);
});

