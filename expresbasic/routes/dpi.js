var express = require("express");
var router = express.Router();
var connection = require('../config/database.js');

// Menampilkan daftar DPI
router.get('/', function(req, res, next) {
    connection.query(
        'SELECT * FROM dpi ORDER BY id_dpi DESC',
        function(err, rows) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/');
            } else {
                res.render('dpi/index', { data: rows });
            }
        }
    );
});

// Menampilkan form tambah DPI
router.get('/create', function(req, res, next) {
    res.render('dpi/create');
});

// Menyimpan DPI baru
router.post('/store', function(req, res, next) {
    let { nama_dpi, luas } = req.body;

    let Data = { nama_dpi, luas };
    connection.query('INSERT INTO dpi SET ?', Data, function(err) {
        if (err) {
            req.flash('error', 'Gagal menyimpan data: ' + err.message);
        } else {
            req.flash('success', 'Berhasil menyimpan data');
        }
        res.redirect('/dpi');
    });
});

// Menampilkan form edit DPI
router.get('/edit/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('SELECT * FROM dpi WHERE id_dpi = ?', [id], function(err, rows) {
        if (err || rows.length === 0) {
            req.flash('error', 'DPI tidak ditemukan');
            res.redirect('/dpi');
        } else {
            res.render('dpi/edit', { dpi: rows[0] });
        }
    });
});

// Memperbarui DPI
router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let { nama_dpi, luas } = req.body;

    let Data = { nama_dpi, luas };
    connection.query('UPDATE dpi SET ? WHERE id_dpi = ?', [Data, id], function(err) {
        if (err) {
            req.flash('error', 'Gagal memperbarui data: ' + err.message);
        } else {
            req.flash('success', 'Berhasil memperbarui data');
        }
        res.redirect('/dpi');
    });
});

// Menghapus DPI
router.get('/delete/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('DELETE FROM dpi WHERE id_dpi = ?', [id], function(err) {
        if (err) {
            req.flash('error', 'Gagal menghapus data: ' + err.message);
        } else {
            req.flash('success', 'Data berhasil dihapus');
        }
        res.redirect('/dpi');
    });
});

module.exports = router;