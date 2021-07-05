var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/posts', function (req, res, next) {
    let token = req.cookies.jwt;
    authService.verifyUser(token)
        .then(user => {
            models.posts
                .findAll({
                    where: { UserId: user.UserId }
                }).then(postsFound => {
                    res.render('posts', { posts: postsFound });
                })
        })
});

router.post('/posts', function (req, res, next) {
    let token = req.cookies.jwt;
    authService.verifyUser(token)
        .then(user => {
            models.posts
                .findOrCreate({
                    where: {
                        PostTitle: req.body.PostTitle,
                        PostBody: req.body.PostBody,
                        UserId: user.UserId
                    }
                }).spread(function (result, created) {
                    if (created) {
                        res.send('Post successfully created');
                    } else {
                        res.send('Post failed!');
                    }
                });
        });
});

router.put("/posts/update/:id", function (req, res, next) {
    let userId = parseInt(req.params.id);
    models.posts
        .update(req.body,
            {
                where: { UserId: userId }
            })
        .then(result => res.redirect('/posts/posts'))
});

router.post('/posts/delete/:id', function (req, res, next) {
    let userId = parseInt(req.params.id);
    models.posts
        .update(req.body,
            { Deleted: true },
            {
                where: { UserId: userId }
            })
        .then(result => res.redirect('/posts/posts'))
});

module.exports = router;