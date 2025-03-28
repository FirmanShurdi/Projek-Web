var express = require("express");
var router = express.Router();
var connection = require('../config/database.js');

// Menampilkan daftar produk
router.get('/', function(req, res, next) {
    connection.query(
        'SELECT * FROM produk a JOIN kategori b ON a.id_kategori = b.id_kategori ORDER BY a.id_produk DESC',
        function(err, rows) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/');
            } else {
                res.render('produk/index', { data: rows });
            }
        }
    );
});

// Menampilkan form tambah produk
router.get('/create', function(req, res, next) {
    connection.query('SELECT * FROM kategori ORDER BY id_kategori DESC', function(err, rows) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/produk');
        } else {
            res.render('produk/create', { data: rows });
        }
    });
});

// Menyimpan produk baru
router.post('/store', function(req, res, next) {
    let { nama_produk, harga_produk, nama_kategori } = req.body;

    // Pertama, cari atau buat kategori
    connection.query('SELECT id_kategori FROM kategori WHERE nama_kategori = ?', [nama_kategori], function(err, rows) {
        if (err) {
            req.flash('error', 'Gagal mencari kategori: ' + err.message);
            res.redirect('/produk');
        } else {
            let id_kategori;

            if (rows.length > 0) {
                // Jika kategori sudah ada, gunakan id_kategori yang ada
                id_kategori = rows[0].id_kategori;
                saveProduct();
            } else {
                // Jika kategori belum ada, buat kategori baru
                connection.query('INSERT INTO kategori (nama_kategori) VALUES (?)', [nama_kategori], function(err, result) {
                    if (err) {
                        req.flash('error', 'Gagal membuat kategori: ' + err.message);
                        res.redirect('/produk');
                        return;
                    }
                    id_kategori = result.insertId;
                    saveProduct();
                });
            }

            function saveProduct() {
                // Simpan produk dengan id_kategori yang sesuai
                let Data = { nama_produk, harga_produk, id_kategori };
                connection.query('INSERT INTO produk SET ?', Data, function(err) {
                    if (err) {
                        req.flash('error', 'Gagal menyimpan data: ' + err.message);
                    } else {
                        req.flash('success', 'Berhasil menyimpan data');
                    }
                    res.redirect('/produk');
                });
            }
        }
    });
});

// Menampilkan form edit produk
router.get('/edit/:id', function(req, res, next) {
    let id = req.params.id;

    // Ambil data produk yang akan diedit
    connection.query('SELECT produk.*, kategori.nama_kategori FROM produk LEFT JOIN kategori ON produk.id_kategori = kategori.id_kategori WHERE produk.id_produk = ?', [id], function(err, produk) {
        if (err || produk.length === 0) {
            req.flash('error', 'Produk tidak ditemukan');
            res.redirect('/produk');
        } else {
            // Ambil data kategori untuk dropdown
            connection.query('SELECT * FROM kategori', function(err, kategori) {
                if (err) {
                    req.flash('error', 'Gagal mengambil data kategori: ' + err.message);
                    res.redirect('/produk');
                } else {
                    // Render form edit dengan data produk dan kategori
                    res.render('produk/edit', { produk: produk[0], data: kategori });
                }
            });
        }
    });
});

router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let { nama_produk, harga_produk, nama_kategori } = req.body;

    // Pertama, cari atau buat kategori
    connection.query('SELECT id_kategori FROM kategori WHERE nama_kategori = ?', [nama_kategori], function(err, rows) {
        if (err) {
            req.flash('error', 'Gagal mencari kategori: ' + err.message);
            res.redirect('/produk');
        } else {
            let id_kategori;

            if (rows.length > 0) {
                // Jika kategori sudah ada, gunakan id_kategori yang ada
                id_kategori = rows[0].id_kategori;
                updateProduct();
            } else {
                // Jika kategori belum ada, buat kategori baru
                connection.query('INSERT INTO kategori (nama_kategori) VALUES (?)', [nama_kategori], function(err, result) {
                    if (err) {
                        req.flash('error', 'Gagal membuat kategori: ' + err.message);
                        res.redirect('/produk');
                        return;
                    }
                    id_kategori = result.insertId;
                    updateProduct();
                });
            }

            function updateProduct() {
                // Update produk dengan id_kategori yang sesuai
                let Data = { nama_produk, harga_produk, id_kategori };
                connection.query('UPDATE produk SET ? WHERE id_produk = ?', [Data, id], function(err) {
                    if (err) {
                        req.flash('error', 'Gagal memperbarui data: ' + err.message);
                    } else {
                        req.flash('success', 'Berhasil memperbarui data');
                    }
                    res.redirect('/produk');
                });
            }
        }
    });
});
// Menghapus produk
router.get('/delete/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('DELETE FROM produk WHERE id_produk = ?', [id], function(err) {
        if (err) {
            req.flash('error', 'Gagal menghapus data: ' + err.message);
        } else {
            req.flash('success', 'Data berhasil dihapus');
        }
        res.redirect('/produk');
    });
});

module.exports = router;