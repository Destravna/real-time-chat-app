const mongoose = require('mongoose');

const schema = mongoose.Schema({
    verificationCode: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    token: {
        type: String,
        require : true
    },
    createdAt: {
        type: Date,
        expires: '5m',
        default: Date.now,
        index: true
    }
});

const VerificationRequest = mongoose.model('verificationRequest', schema);

module.exports = VerificationRequest;