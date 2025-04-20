var express = require("express");
var router = express.Router();
var connection = require('../config/database.js');

// Menampilkan daftar DPI
router.get('/', function(req, res, next) {
    connection.query(
        'SELECT * FROM pemilik ORDER BY id_pemilik DESC',
        function(err, rows) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/');
            } else {
                res.render('pemilik/index', { data: rows });
            }
        }
    );
});

// Menampilkan form tambah DPI
router.get('/create', function(req, res, next) {
    res.render('pemilik/create');
});

// Menyimpan DPI baru
router.post('/store', function(req, res, next) {
    let { nama_pemilik, alamat, no_hp } = req.body;

    let Data = { nama_pemilik, alamat, no_hp };
    connection.query('INSERT INTO pemilik SET ?', Data, function(err) {
        if (err) {
            req.flash('error', 'Gagal menyimpan data: ' + err.message);
        } else {
            req.flash('success', 'Berhasil menyimpan data');
        }
        res.redirect('/pemilik');
    });
});

// Menampilkan form edit DPI
router.get('/edit/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('SELECT * FROM pemilik WHERE id_pemilik = ?', [id], function(err, rows) {
        if (err || rows.length === 0) {
            req.flash('error', 'pemilik tidak ditemukan');
            res.redirect('/pemilik');
        } else {
            res.render('pemilik/edit', { pemilik: rows[0] });
        }
    });
});

// Memperbarui DPI
router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let { nama_pemilik, alamat, no_hp } = req.body;

    let Data = { nama_pemilik, alamat, no_hp };
    connection.query('UPDATE pemilik SET ? WHERE id_pemilik = ?', [Data, id], function(err) {
        if (err) {
            req.flash('error', 'Gagal memperbarui data: ' + err.message);
        } else {
            req.flash('success', 'Berhasil memperbarui data');
        }
        res.redirect('/pemilik');
    });
});

// Menghapus DPI
router.get('/delete/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('DELETE FROM pemilik WHERE id_pemilik = ?', [id], function(err) {
        if (err) {
            req.flash('error', 'Gagal menghapus data: ' + err.message);
        } else {
            req.flash('success', 'Data berhasil dihapus');
        }
        res.redirect('/pemilik');
    });
});

module.exports = router;