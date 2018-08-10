const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
"firstname": "Tony",
"lastname": "Lee",
"telnum": "12345678",
"email": "asd@gmail.com",
"agree": false,
"contacttype": "None",
"message": "good",
"id": 1
*/

var feedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    telnum: {
        type: String
    },
    email: {
        type: String
    },
    agree: {
        type: Boolean,
        default: false
    },
    contacttype: {
        type: String,
        default: 'None'
    },
    message: {
      type: String,
      default: ''
    }

  }, {
    timestamps: true
});

var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;
