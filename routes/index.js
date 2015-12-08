var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mixtour Event - Accueil' });
});

router.get('/login-registration', function(req, res, next) {
  res.render('login-registration', { title: 'Mixtour Event - Inscription / Connexion' });
});

router.get('/faq', function(req, res, next) {
  res.render('faq', { title: 'Mixtour Event - Règles / FAQ' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Mixtour Event - Règles / FAQ' });
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Mixtour Event - Règles / FAQ' });
});

module.exports = router;
