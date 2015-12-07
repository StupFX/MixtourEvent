var mysql = require('mysql');
var Bookshelf = require('bookshelf');

var mySqlClient = mysql.createConnection({
   host: "localhost",
    user : "root",
    password : "toto",
    database : "MixtourDB"
});

var DB = Bookshelf.initialize({
    client: 'mysql',
    connection: config
});
module.exports.DB = DB;

mySqlClient.connect(function(err){
   if(err){
       console.log('Connection error');
       return;
   }
    console.log('Connection established');
});

var selectQuery = 'SELECT * FROM Player';

mySqlClient.query(
    selectQuery,
    function select(error, results, fields){
        if(error) {
            console.log(error);
            mySqlClient.end();
            return;
        }
        if (results.length > 0) {
            var firstResult = results[0];
            console.log('nickname: ' + firstResult['nickname']);
            console.log('password: ' + firstResult['password']);
            console.log('mail: ' + firstResult['mail']);

        } else {
            console.log("Pas de données");
        }
        mySqlClient.end();
    }
);