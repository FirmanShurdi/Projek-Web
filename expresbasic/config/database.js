let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_barang'
});

connection.connect(function(error){
    if(!!error){
        console.log(error);
    } else {
        console.log('connection success');
    }
});

module.exports = connection;