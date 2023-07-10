const Message = require('../db/schemas/messageSchema');
const router = require('express').Router();

router.post('/sendmsg', async (req, res) => {
    try {
        console.log(req.body);
        const msg = req.body;
        const data = await Message.create(msg);
        // console.log(data);
        res.status(200).json({ status: true, msg: 'message sent successfully' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
});

router.get('/getmsgs', async (req, res) => {
    try {
        const senderId = req.query.sender;
        const receiverId = req.query.receiver;
        const msgs = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        });
        res.status(200).json({status:true, msgs:msgs, msg:'successfully fetched'});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
})


module.exports = router;
