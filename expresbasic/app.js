var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash'); // Import express-flash
var session = require('express-session'); // Import express-session

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kategoriRouter = require('./routes/kategori');
var mahasiswaRouter = require('./routes/mahasiswa'); // Tambahkan Router Mahasiswa
var kartu_keluargaRouter = require('./routes/kartu_keluarga');
var produkRouter = require('./routes/produk');
var app = express();

// Setup View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Setup Session
app.use(session({
    cookie: { maxAge: 6000 },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
}));

// Gunakan Flash Messages
app.use(flash());

// Setup Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/kategori', kategoriRouter);
app.use('/mahasiswa', mahasiswaRouter); 
app.use('/kartu_keluarga', kartu_keluargaRouter); 
app.use('/produk', produkRouter); 


// Handle 404 Not Found
app.use(function(req, res, next) {
    next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
