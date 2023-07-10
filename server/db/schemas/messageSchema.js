const mongoose  = require('mongoose');

const messageSchema = mongoose.Schema({
    message:{
        type:String,
        required: true
    },
    sender:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:'true'
    },
    receiver:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

}, {timestamps : true});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;