var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');

// Pastikan semua file router ada di direktori routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kategoriRouter = require('./routes/kategori');
var mahasiswaRouter = require('./routes/mahasiswa');
var kartu_keluargaRouter = require('./routes/kartu_keluarga');
var produkRouter = require('./routes/produk');
var dpiRouter = require('./routes/dpi');
var alat_tangkapRouter = require('./routes/alat_tangkap');
var pemilikRouter = require('./routes/pemilik');
var kapalRouter = require('./routes/kapal');

var app = express();

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Perbaikan konfigurasi session
app.use(session({
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    },
    store: new session.MemoryStore(),
    saveUninitialized: false, // diubah ke false untuk GDPR compliance
    resave: false, // diubah ke false karena MemoryStore tidak membutuhkannya
    secret: 'your-secret-key-here' // ganti dengan secret key yang kuat
}));

app.use(flash());

// Setup Routes - pastikan urutan tepat
app.use('/', indexRouter); // Ini harus ada dan berfungsi
app.use('/users', usersRouter);
app.use('/kategori', kategoriRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/kartu_keluarga', kartu_keluargaRouter);
app.use('/produk', produkRouter);
app.use('/dpi', dpiRouter);
app.use('/alat_tangkap', alat_tangkapRouter);
app.use('/pemilik', pemilikRouter);
app.use('/kapal', kapalRouter);


// Handle 404 Not Found
app.use(function(req, res, next) {
    next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
