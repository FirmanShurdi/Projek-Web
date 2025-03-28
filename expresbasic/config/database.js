let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_barang'  // Pastikan database ini memiliki tabel 'mahasiswa'
});

connection.connect(function(error){
    if (error) {
        console.log("Koneksi gagal:", error);
    } else {
        console.log('Koneksi berhasil ke database bd_barang');
    }
});

module.exports = connection;
