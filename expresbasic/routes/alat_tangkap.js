var express = require("express");
var router = express.Router();
var connection = require('../config/database.js');

// Menampilkan daftar DPI
router.get('/', function(req, res, next) {
    connection.query(
        'SELECT * FROM alat_tangkap ORDER BY id_alat_tangkap DESC',
        function(err, rows) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/');
            } else {
                res.render('alat_tangkap/index', { data: rows });
            }
        }
    );
});

// Menampilkan form tambah DPI
router.get('/create', function(req, res, next) {
    res.render('alat_tangkap/create');
});

// Menyimpan DPI baru
router.post('/store', function(req, res, next) {
    let { nama_alat_tangkap } = req.body;

    let Data = { nama_alat_tangkap };
    connection.query('INSERT INTO alat_tangkap SET ?', Data, function(err) {
        if (err) {
            req.flash('error', 'Gagal menyimpan data: ' + err.message);
        } else {
            req.flash('success', 'Berhasil menyimpan data');
        }
        res.redirect('/alat_tangkap');
    });
});

// Menampilkan form edit DPI
router.get('/edit/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('SELECT * FROM alat_tangkap WHERE id_alat_tangkap = ?', [id], function(err, rows) {
        if (err || rows.length === 0) {
            req.flash('error', 'alat_tangkap tidak ditemukan');
            res.redirect('/alat_tangkap');
        } else {
            res.render('alat_tangkap/edit', { alat_tangkap: rows[0] });
        }
    });
});

// Memperbarui DPI
router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let { nama_alat_tangkap } = req.body;

    let Data = { nama_alat_tangkap };
    connection.query('UPDATE alat_tangkap SET ? WHERE id_alat_tangkap = ?', [Data, id], function(err) {
        if (err) {
            req.flash('error', 'Gagal memperbarui data: ' + err.message);
        } else {
            req.flash('success', 'Berhasil memperbarui data');
        }
        res.redirect('/alat_tangkap');
    });
});

// Menghapus DPI
router.get('/delete/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('DELETE FROM alat_tangkap WHERE id_alat_tangkap = ?', [id], function(err) {
        if (err) {
            req.flash('error', 'Gagal menghapus data: ' + err.message);
        } else {
            req.flash('success', 'Data berhasil dihapus');
        }
        res.redirect('/alat_tangkap');
    });
});

module.exports = router;