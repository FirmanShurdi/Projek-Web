var express = require("express");
var router = express.Router();
var connection = require("../config/database.js");

// 📌 GET: Tampilkan semua data kartu_keluarga
router.get("/", function (req, res, next) {
    connection.query("SELECT * FROM kartu_keluarga ORDER BY no_kk DESC", function (err, rows) {
        if (err) {
            console.error("❌ Error SELECT:", err);
            req.flash("error", "Gagal mengambil data");
            res.render("kartu_keluarga/index", { data: [], messages: req.flash() });
        } else {
            res.render("kartu_keluarga/index", { data: rows, messages: req.flash() });
        }
    });
});

router.get('/create', function(req, res, next) {
    connection.query('SELECT * FROM kartu_keluarga ORDER BY no_kk DESC', function(err, rows) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/kartu_keluar');
        } else {
            res.render('kartu_keluarga/create', { data: rows });
        }
    });
});

// 📌 POST: Simpan data baru
router.post("/store", function (req, res, next) {
    let { no_kk, alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi } = req.body;
    let Data = { no_kk, alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi };

    if (!no_kk || !alamat) {
        req.flash("error", "No KK dan Alamat harus diisi");
        return res.redirect("/kartu_keluarga/create");
    }

    connection.query("INSERT INTO kartu_keluarga SET ?", Data, function (err, result) {
        if (err) {
            console.error("❌ Error INSERT:", err);
            req.flash("error", "Gagal menyimpan data");
        } else {
            req.flash("success", "Berhasil menyimpan data");
        }
        res.redirect("/kartu_keluarga");
    });
});

// 📌 GET: Form edit data
router.get("/edit/:no_kk", function (req, res, next) {
    let no_kk = req.params.no_kk;
    console.log("🔍 Mengedit data dengan no_kk:", no_kk); // Debugging

    connection.query("SELECT * FROM kartu_keluarga WHERE no_kk = ?", [no_kk], function (err, rows) {
        if (err) {
            console.error("❌ Error SELECT:", err);
            req.flash("error", "Gagal mengambil data");
            res.redirect("/kartu_keluarga");
        } else if (rows.length === 0) {
            console.log("⚠ Data tidak ditemukan:", no_kk);
            req.flash("error", "Data tidak ditemukan");
            res.redirect("/kartu_keluarga");
        } else {
            let data = rows[0];
            for (let key in data) if (data[key] === null) data[key] = ""; // Ganti `null` jadi string kosong
            console.log("✅ Data dikirim ke EJS:", data); // Debugging
            res.render("kartu_keluarga/edit", { data: data, messages: req.flash() });
        }
    });
});

// 📌 POST: Update data
router.post("/update/:no_kk", function (req, res, next) {
    let no_kk = req.params.no_kk;
    let { alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi } = req.body;
    let Data = { alamat, rt, rw, kode_pos, desa_kelurahan, kecamatan, kabupaten_kota, provinsi };

    console.log("🔄 Mengupdate data:", Data, "Untuk no_kk:", no_kk); // Debugging

    if (!alamat) {
        req.flash("error", "Alamat harus diisi");
        return res.redirect(`/kartu_keluarga/edit/${no_kk}`);
    }

    connection.query("UPDATE kartu_keluarga SET ? WHERE no_kk = ?", [Data, no_kk], function (err, result) {
        if (err) {
            console.error("❌ Error UPDATE:", err);
            req.flash("error", "Gagal memperbarui data");
        } else {
            console.log("✅ UPDATE berhasil, affected rows:", result.affectedRows);
            req.flash("success", "Berhasil memperbarui data");
        }
        res.redirect("/kartu_keluarga");
    });
});

// 📌 GET: Hapus data
router.get("/delete/:no_kk", function (req, res, next) {
    let no_kk = req.params.no_kk;
    console.log("🗑 Menghapus data dengan no_kk:", no_kk); // Debugging

    connection.query("DELETE FROM kartu_keluarga WHERE no_kk = ?", [no_kk], function (err, result) {
        if (err) {
            console.error("❌ Error DELETE:", err);
            req.flash("error", "Gagal menghapus data");
        } else {
            console.log("✅ DELETE berhasil, affected rows:", result.affectedRows);
            req.flash("success", "Data berhasil dihapus");
        }
        res.redirect("/kartu_keluarga");
    });
});

module.exports = router;