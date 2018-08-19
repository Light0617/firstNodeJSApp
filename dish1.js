const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favourites = require('../models/favourite');

const favouriteRouter = express.Router();
favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user })
            .populate('dishes')
            .populate('user')
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favourites')

    })
    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user })
            .then((favourite) => {
                if (favourite != null) {

                    var dishIDs = req.body;
                    for (var i = 0; i < dishIDs.length; ++i) {
                        if (favourite.dishes.indexOf(dishIDs[i]._id) < 0)
                            favourite.dishes.push(dishIDs[i]._id);
                    }
                    favourite.save()
                        .then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        }, (err) => next(err))
                        .catch((err) => next(err));

                } else {

                    Favourites.create({ user: req.user._id })
                        .then((favourite) => {
                            var dishIDs = req.body;
                            for (var i = 0; i < dishIDs.length; ++i) {
                                if (favourite.dishes.indexOf(dishIDs[i]._id) < 0)
                                    favourite.dishes.push(dishIDs[i]._id);
                            }
                            favourite.save()
                                .then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favourite);
                                }, (err) => next(err))
                                .catch((err) => next(err));

                        }, (err) => next(err))
                        .catch((err) => next(err));

                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOneAndRemove({ user: req.user })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


favouriteRouter.route('/:dishId')
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /dishes/' + req.params.dishId);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/' + req.params.dishId);

    })

    .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user })
            .then((favourite) => {
                if (favourite != null) {
                    if (favourite.dishes.indexOf(req.params.dishId) < 0)
                        favourite.dishes.push(req.params.dishId)
                    favourite.save()

                        .then((favourite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favourite);
                        }, (err) => next(err))
                        .catch((err) => next(err));

                } else {
                    console.log("favourite null");
                    Favourites.create({ user: req.user._id })
                        .then((favourite) => {
                            if (favourite.dishes.indexOf(req.params.dishId) < 0)
                                favourite.dishes.push(req.params.dishId)
                            favourite.save()

                                .then((favourite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favourite);
                                }, (err) => next(err))
                                .catch((err) => next(err));

                        }, (err) => next(err))
                        .catch((err) => next(err));

                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user })
            .then((favourite) => {
                if (favourite != null) {
                    if (favourite.dishes.indexOf(req.params.dishId) > -1)
                        favourite.dishes.remove(req.params.dishId)
                    favourite.save()

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                }
            }, (err) => next(err))
            .catch((err) => next(err));

    });

module.exports = favouriteRouter;
