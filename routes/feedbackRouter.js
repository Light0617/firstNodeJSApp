const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Feedbacks = require('../models/feedbacks');

const feedbackRouter = express.Router();

feedbackRouter.use(bodyParser.json());


feedbackRouter.route('/')
.get((req,res,next) => {
    Feedbacks.find({})
    .then((feedbacks) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedbacks);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Feedbacks.create(req.body)
    .then((feedback) => {
        console.log('Feedback Created ', feedback);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /feedbacks');
})
.delete((req, res, next) => {
    Feedbacks.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

feedbackRouter.route('/:promoId')
.get((req,res,next) => {
    Feedbacks.findById(req.params.feedbackId)
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /feedbacks/'+ req.params.feedbackId);
})
.put((req, res, next) => {
    Feedbacks.findByIdAndUpdate(req.params.feedbackId, {
        $set: req.body
    }, { new: true })
    .then((feedback) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feedback);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Feedbacks.findByIdAndRemove(req.params.feedbackId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports =  feedbackRouter;
