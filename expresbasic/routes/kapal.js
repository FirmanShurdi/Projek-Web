var express = require("express");
var router = express.Router();
var connection = require('../config/database.js');
var async = require('async');

// Menampilkan daftar kapal dengan join ke tabel terkait
router.get('/', function(req, res, next) {
    connection.query(`
        SELECT k.*, p.nama_pemilik, d.nama_dpi, a.nama_alat_tangkap 
        FROM kapal k
        LEFT JOIN pemilik p ON k.id_pemilik = p.id_pemilik
        LEFT JOIN dpi d ON k.id_dpi = d.id_dpi
        LEFT JOIN alat_tangkap a ON k.id_alat_tangkap = a.id_alat_tangkap
        ORDER BY k.id_kapal DESC
    `, function(err, rows) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            res.render('kapal/index', { 
                data: rows,
                success: req.flash('success'),
                error: req.flash('error')
            });
        }
    });
});

// Menampilkan form tambah kapal
router.get('/create', function(req, res, next) {
    // Ambil data untuk dropdown
    connection.query(`
        SELECT p.id_pemilik, p.nama_pemilik FROM pemilik p
        UNION ALL
        SELECT d.id_dpi, d.nama_dpi FROM dpi d
        UNION ALL
        SELECT a.id_alat_tangkap, a.nama_alat_tangkap FROM alat_tangkap a
    `, function(err, dropdownData) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/kapal');
        }
        res.render('kapal/create', { 
            dropdownData: dropdownData,
            error: req.flash('error')
        });
    });
});

// Menyimpan kapal baru
router.post('/store', function(req, res, next) {
    let { nama_kapal, nama_pemilik, nama_dpi, nama_alat_tangkap } = req.body;

    // Pertama, cari atau buat data relasi
    async.auto({
        pemilik: function(callback) {
            connection.query('SELECT id_pemilik FROM pemilik WHERE nama_pemilik = ?', [nama_pemilik], function(err, result) {
                if (err) return callback(err);
                if (result.length > 0) return callback(null, result[0].id_pemilik);
                
                connection.query('INSERT INTO pemilik (nama_pemilik) VALUES (?)', [nama_pemilik], function(err, result) {
                    if (err) return callback(err);
                    callback(null, result.insertId);
                });
            });
        },
        dpi: function(callback) {
            connection.query('SELECT id_dpi FROM dpi WHERE nama_dpi = ?', [nama_dpi], function(err, result) {
                if (err) return callback(err);
                if (result.length > 0) return callback(null, result[0].id_dpi);
                
                connection.query('INSERT INTO dpi (nama_dpi) VALUES (?)', [nama_dpi], function(err, result) {
                    if (err) return callback(err);
                    callback(null, result.insertId);
                });
            });
        },
        alatTangkap: function(callback) {
            connection.query('SELECT id_alat_tangkap FROM alat_tangkap WHERE nama_alat_tangkap = ?', [nama_alat_tangkap], function(err, result) {
                if (err) return callback(err);
                if (result.length > 0) return callback(null, result[0].id_alat_tangkap);
                
                connection.query('INSERT INTO alat_tangkap (nama_alat_tangkap) VALUES (?)', [nama_alat_tangkap], function(err, result) {
                    if (err) return callback(err);
                    callback(null, result.insertId);
                });
            });
        }
    }, function(err, results) {
        if (err) {
            req.flash('error', 'Gagal menyimpan data: ' + err.message);
            return res.redirect('/kapal/create');
        }

        let Data = { 
            nama_kapal, 
            id_pemilik: results.pemilik, 
            id_dpi: results.dpi, 
            id_alat_tangkap: results.alatTangkap 
        };
        
        connection.query('INSERT INTO kapal SET ?', Data, function(err) {
            if (err) {
                req.flash('error', 'Gagal menyimpan data: ' + err.message);
            } else {
                req.flash('success', 'Berhasil menyimpan data kapal');
            }
            res.redirect('/kapal');
        });
    });
});

// Menampilkan form edit kapal
router.get('/edit/:id', function(req, res, next) {
    let id = req.params.id;

    // Ambil data kapal dan data dropdown
    connection.query(`
        SELECT k.*, p.nama_pemilik, d.nama_dpi, a.nama_alat_tangkap 
        FROM kapal k
        LEFT JOIN pemilik p ON k.id_pemilik = p.id_pemilik
        LEFT JOIN dpi d ON k.id_dpi = d.id_dpi
        LEFT JOIN alat_tangkap a ON k.id_alat_tangkap = a.id_alat_tangkap
        WHERE k.id_kapal = ?
    `, [id], function(err, kapalData) {
        if (err || kapalData.length === 0) {
            req.flash('error', 'Kapal tidak ditemukan');
            return res.redirect('/kapal');
        }

        connection.query(`
            SELECT p.id_pemilik, p.nama_pemilik FROM pemilik p
            UNION ALL
            SELECT d.id_dpi, d.nama_dpi FROM dpi d
            UNION ALL
            SELECT a.id_alat_tangkap, a.nama_alat_tangkap FROM alat_tangkap a
        `, function(err, dropdownData) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/kapal');
            }
            
            res.render('kapal/edit', { 
                kapal: kapalData[0],
                dropdownData: dropdownData,
                error: req.flash('error')
            });
        });
    });
});

// Memperbarui data kapal
router.post('/update/:id', function(req, res, next) {
    let id = req.params.id;
    let { nama_kapal, nama_pemilik, nama_dpi, nama_alat_tangkap } = req.body;

    // Pertama, cari atau buat data relasi
    async.auto({
        pemilik: function(callback) {
            connection.query('SELECT id_pemilik FROM pemilik WHERE nama_pemilik = ?', [nama_pemilik], function(err, result) {
                if (err) return callback(err);
                if (result.length > 0) return callback(null, result[0].id_pemilik);
                
                connection.query('INSERT INTO pemilik (nama_pemilik) VALUES (?)', [nama_pemilik], function(err, result) {
                    if (err) return callback(err);
                    callback(null, result.insertId);
                });
            });
        },
        dpi: function(callback) {
            connection.query('SELECT id_dpi FROM dpi WHERE nama_dpi = ?', [nama_dpi], function(err, result) {
                if (err) return callback(err);
                if (result.length > 0) return callback(null, result[0].id_dpi);
                
                connection.query('INSERT INTO dpi (nama_dpi) VALUES (?)', [nama_dpi], function(err, result) {
                    if (err) return callback(err);
                    callback(null, result.insertId);
                });
            });
        },
        alatTangkap: function(callback) {
            connection.query('SELECT id_alat_tangkap FROM alat_tangkap WHERE nama_alat_tangkap = ?', [nama_alat_tangkap], function(err, result) {
                if (err) return callback(err);
                if (result.length > 0) return callback(null, result[0].id_alat_tangkap);
                
                connection.query('INSERT INTO alat_tangkap (nama_alat_tangkap) VALUES (?)', [nama_alat_tangkap], function(err, result) {
                    if (err) return callback(err);
                    callback(null, result.insertId);
                });
            });
        }
    }, function(err, results) {
        if (err) {
            req.flash('error', 'Gagal memperbarui data: ' + err.message);
            return res.redirect('/kapal/edit/' + id);
        }

        let Data = { 
            nama_kapal, 
            id_pemilik: results.pemilik, 
            id_dpi: results.dpi, 
            id_alat_tangkap: results.alatTangkap 
        };
        
        connection.query('UPDATE kapal SET ? WHERE id_kapal = ?', [Data, id], function(err) {
            if (err) {
                req.flash('error', 'Gagal memperbarui data: ' + err.message);
            } else {
                req.flash('success', 'Berhasil memperbarui data kapal');
            }
            res.redirect('/kapal');
        });
    });
});

// Menghapus kapal
router.get('/delete/:id', function(req, res, next) {
    let id = req.params.id;

    connection.query('DELETE FROM kapal WHERE id_kapal = ?', [id], function(err) {
        if (err) {
            req.flash('error', 'Gagal menghapus data: ' + err.message);
        } else {
            req.flash('success', 'Data kapal berhasil dihapus');
        }
        res.redirect('/kapal');
    });
});

module.exports = router;