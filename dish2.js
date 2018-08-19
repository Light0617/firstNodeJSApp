const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ 'user': req.user._id })
            .populate('user')
            .populate('dishes')
            .then(
                (favorites) => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },
                (error) => next(error)
            )
            .catch((error) => next(error))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ 'user': req.user._id })
            .then(
                (favorites) => {

                    // If favorite exists => update it
                    // Else create it
                    if (favorites) {

                        // Validation for repeated favprite dishes
                        // If some one is repeated => Bad Request
                        var newFavoriteDishes = req.body;

                        for (var i = 0; i < newFavoriteDishes.length; i++) {

                            var indexOf = favorites.dishes.indexOf(newFavoriteDishes[i]._id);
                            if (indexOf >= 0) {
                                res.statusCode = 400;
                                res.end('Dish with id: ' + newFavoriteDishes[i]._id + ' is already a favorite dish');
                                return;
                            }
                            else {
                                favorites.dishes.push(newFavoriteDishes[i]);
                            }
                        }

                        favorites.save()
                            .then((favorites) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            }, (err) => next(err));
                    }
                    else {

                        favorite = {
                            user: req.user._id,
                            dishes: req.body
                        };

                        Favorites.create(favorite)
                            .then(
                                (favorites) => {

                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorites);
                                },
                                (error) => next(error)
                            )
                            .catch((error) => next(error))
                    }
                },
                (err) => next(err)
            )
            .catch((error) => next(error))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOneAndRemove({ 'user': req.user._id })
            .then(
                (resp) => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);

                },
                (err) => next(err)
            )
            .catch((error) => next(error))
    });


favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /favorites/' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ 'user': req.user._id })
            .then(
                (favorites) => {

                    // If favorite exists => update it
                    // Else create it
                    if (favorites) {

                        // Validation for repeated favprite dishes

                        var indexOf = favorites.dishes.indexOf(req.params.dishId);
                        if (indexOf > -1) {
                            res.statusCode = 400;
                            res.end('Dish with id: ' + req.params.dishId + ' is already a favorite dish');
                            return;
                        }

                        favorites.dishes.push(req.params.dishId);

                        favorites.save()
                            .then((favorites) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            }, (err) => next(err));
                    }
                    else {

                        favorite = {
                            user: req.user._id,
                            dishes: [{ _id: req.params.dishId }]
                        };

                        Favorites.create(favorite)
                            .then(
                                (favorites) => {

                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorites);
                                },
                                (error) => next(error)
                            )
                            .catch((error) => next(error))
                    }
                },
                (err) => next(err)
            )
            .catch((error) => next(error))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ 'user': req.user._id })
            .then(
                (favorite) => {

                    // Get index of favorite dish based on the dishId
                    var indexOf = favorite.dishes.indexOf(req.params.dishId);

                    if (indexOf > -1) {
                        favorite.dishes.splice(indexOf, 1);
                    }

                    Favorites.create(favorite)
                        .then(
                            (favorites) => {

                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorites);
                            },
                            (error) => next(error)
                        )
                        .catch((error) => next(error))
                },
                (error) => next(error)
            )
            .catch((error) => next(error))
    });

module.exports = favoriteRouter;
