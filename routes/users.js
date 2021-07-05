var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function (req, res, next) {
  res.render('signup')
});

router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: { Username: req.body.username },
      defaults: {
        FirstName: req.body.firstname,
        LastName: req.body.lastname,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password)
      }
    }).spread(function (result, created) {
      if (created) {
        res.send('User successfully created');
      } else {
        res.send('This user already exists!');
      }
    });
});

router.get('/login', function (req, res, next) {
  res.render('login')
});

router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username,
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({
        message: "Login Failed"
      });
    }
    if (user) {
      let token = authService.signUser(user);
      res.cookie('jwt', token);
      res.redirect('/users/profile');
    } else {
      console.log('Wrong password');
      res.redirect('login')
    }
  });
});

router.get('/admin', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        if (user.Admin) {
          models.users.findAll({
            where: { Deleted: false }
          }).then(userFound => {

            res.render('admin', {

              users: userFound,
              UserId: userFound.UserId,
              FirstName: userFound.FirstName,
              LastName: userFound.LastName,
              Email: userFound.Email,
              Username: userFound.Username
            })
          });
        } else {
          res.send("You are not a Admin!")
        }
      });

  }
});

router.post('/admin/delete/:id', function (req, res, next) {
  let userId = parseInt(req.params.id);
  models.users
    .update(
      { Deleted: true },
      {
        where: { UserId: userId }
      })
    .then(result => res.redirect('/users/admin'))
});

router.get('/profile', function (req, res, next) {
  let token = req.cookies.jwt;
  authService.verifyUser(token)
    .then(user => {
      if (user) {
        res.render('profile', {
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          Username: user.Username
        });
      } else {
        res.status(401);
        res.send('Must be logged in');
      }
    });
});

router.get('/profile/:id', function (req, res, next) {

  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token)
      .then(user => {
        models.users.findOne({
          where: { UserId: req.params.id }
        }).then(userFound => {
          if (user.Admin) {
            res.render('profile', {
              FirstName: userFound.FirstName,
              LastName: userFound.LastName,
              Email: userFound.Email,
              UserId: userFound.UserId,
              Username: userFound.Username
            });
          } else {
            res.status(401);
            res.send('You are not a Admin');
          }
        })
      });
  } else {
    res.status(401);
    res.send('Must be logged in');
  }
});

//Logout
router.get('/logout', function (req, res, next) {
  res.cookie('jwt', "", { expires: new Date(0) });
  res.send('Successfully logged out!');
});

module.exports = router;
