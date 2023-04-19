const mongoose = require('mongoose');
const channelmodel = new mongoose.Schema({
    name: {
        type: String,
    },
    email: { type: String, required: true, unique: true, index: true },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        maxlength: [20, 'Password cannot exceed 20 characters'],
        match: [
            // /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    work: {
        type: String,
    },
    address: {
        type: String,
    }

})
const dbchannelmodel = mongoose.model('signup', channelmodel);
module.exports = dbchannelmodel;