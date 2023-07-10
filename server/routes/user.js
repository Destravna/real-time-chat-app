const express = require('express');
const router = express.Router();
const generateVerificationCode = require('../utils/codeGenerator')
const mail = require('../utils/mailing')
const User = require('../db/schemas/userSchema')
const VerificationRequest = require('../db/schemas/verificationRequestSchema');
const bcrypt = require('bcrypt');
const { onlineUsers, disconnect } = require('../socketHandler');

//registering the user
router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        // console.log(data);
        const alreadyExists = await User.find({ username: data.username });
        //if user already exists then request unauthorized
        // console.log(alreadyExists);
        if (alreadyExists.length !== 0) {
            res.status(200).json({ status: false, msg: 'account already exists' });
        }
        else {
            //insert user into database

            //hashing the password of the user
            const hashedPassword = await bcrypt.hash(data.password, 10);
            //update the password in the data
            data['password'] = hashedPassword;
            //creating the user
            const createdUser = await User.create(data);
            //id of the created user to use in verification queue
            const id = createdUser._id.toString();
            //cretaing the verification of code of size 6
            const oneTimeCode = generateVerificationCode(6);
            //data to be inserted in verification queue
            const verificationRequest = {
                user: id,
                token: oneTimeCode
            };
            //adding the request to the queue
            mail(oneTimeCode, createdUser.username);
            const verifyRequest = await VerificationRequest.create(verificationRequest);
            // console.log(verifyRequest);
            res.status(200).json({ status: true, user: createdUser, msg: 'account created' });
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
});

//send new verification code
router.get('/getcode', async(req, res)=>{
    try{
        const userId = req.query._id;
        const userEmail = req.query.username;
        // console.log(req.query);
        const verificationRequest = await VerificationRequest.findOne({ user: userId }); 
        // console.log('verifReq', verificationRequest);
        
        if(verificationRequest){
            // console.log('no object creation');
            mail(verificationRequest.token, userEmail);
            res.status(200).json({status:true, msg:'verification code sent to your email'});
        }   
        else{
            // console.log('object creation');
            const oneTimeCode = generateVerificationCode(6);
            const verificationRequest = {
                user: userId,
                token: oneTimeCode
            };
            mail(oneTimeCode, userEmail);
            const verifyRequest = await VerificationRequest.create(verificationRequest);
            // console.log(verifyRequest);
            res.status(200).json({status:true, msg:'verification code sent to your email'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
})



//verify the user email
router.post('/verify', async (req, res) => {
    try {
        const submittedData = req.body;
        console.log(req.body);
        console.log(submittedData.userId);
        const verificationRequest = await VerificationRequest.find({ user: submittedData.userId });
        console.log('verification request', verificationRequest);
        if (verificationRequest.length === 1) {
            if (verificationRequest[0].token === submittedData.token) {
                const verifyUser = await  User.findByIdAndUpdate(submittedData.userId, {
                    isVerified: true
                }, {
                    new: true
                });
                console.log('verified user', verifyUser);
                res.status(200).json({ status: true, msg: 'verified succesfully', user: verifyUser });
            }
            
        }
        else {
            res.status(200).json({ status: false, msg: 'token expired please create a new one'});
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
})



router.post('/login', async (req, res) => {
    try {
        // console.log('login route');
        const data = req.body;
        // console.log(data);
        //find user with the username
        const user = await User.findOne({ username: data.username });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
            if (isPasswordCorrect) {
                res.status(200).json({ status: true, user: user, msg: 'logged in' });
            }
            else {
                res.status(200).json({ status: false, user: null, msg: 'wrong username or password' });
            }

        }
        else {
            res.status(200).json({ status: false, msg: 'no account found' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
})

router.post('/setavatar', async (req, res) => {
    try {
        const image = req.body.avatarImage;
        const user = await User.findByIdAndUpdate(req.body._id, {
            isAvatarImageSet: true,
            avatarImage: image
        }, {
            new: true
        });
        res.status(200).json({ status: true, msg: 'avatar set', user: user });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
})

router.get('/allUsers', async (req, res) => {
    try {
        const users = await User.find({}).select({
            username: 1,
            _id: 1,
            avatarImage: 1
        });
        // console.log(users);
        res.status(200).json({ status: true, msg: 'all users', users: users });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Internal Server Error' });
    }
})

router.get('/logout/:id', async(req, res)=>{
    try{
        console.log('logout received');
        disconnect(req.params.id);
        res.status(200).json({status:true, msg:'logout successfully'})
    }
    catch(err){
        console.log(err);
    }
})


module.exports = router;