const nodemailer = require('nodemailer')
require('dotenv').config();

const sendEmail = async(verificationCode, username)=>{
    console.log('sending email to ' + username);
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: process.env.mail,
            pass: process.env.mail_pass
        }
    });

    const mailOptions = {
        from: process.env.mail,
        to: username,
        subject:'Verification Code',
        html:'<h2>your verification code is <br/> <h1>' + verificationCode  + '</h1></h2>'
    }

    try{
        const res = await transporter.sendMail(mailOptions);
        console.log('mail sent');
    }
    catch(err){
        console.log(err);
    }
}

module.exports = sendEmail

