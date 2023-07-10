const mongoose  = require('mongoose');

const user = mongoose.Schema({
    'username':{
        type: String,
        minLength : 5,
        require : true,
        unique: true
    },
    'password':{
        type: String,
        minLength : 8,
        require: true
    },
    isAvatarImageSet:{
        type:Boolean,
        default: false
    },
    avatarImage:{
        type:String,
        default:""
    },
    isVerified:{
        type:Boolean,
        default:false
    }
});

const User = mongoose.model('user', user);

module.exports = User;