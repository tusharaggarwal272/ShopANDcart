const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const otpGenerator = require('otp-generator');

const User = require('../models/user');
const Otp = require('../models/otpModel');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports.signUp = async (req, res) => {
    var {number}=req.body;
    const{email}=req.body;
    // console.log(number)

    const user = await User.findOne({
        number: req.body.number
    });
    if (user) return res.status(400).send("User already registered!");
    const OTP = otpGenerator.generate(6, {
        digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    });
    // var number = number;

    console.log(OTP);
    // console.log(number);

    const hashed = await bcrypt.hash(OTP, 12);
    // console.log(hashed);
    const otp = new Otp({ number: number, otp: hashed });
    // console.log(otp);
    var result = await otp.save();
    var nc=number;

    // console.log(result);
    number = `+91${number}`;

    client.messages
        .create({
            body: `Your Verification code is ${OTP}`,
            from: '+17166870612',
            to: number,
        })
        .then(message => console.log(message.sid));
    res.redirect(`/api/user/signup/verify/${nc}/${email}`);


    // return res.status(200).send(`Otp send successfully on number ${number}`);

}

module.exports.verifyOtp = async (req, res) => {

    const otpholder = await Otp.find({
        number: req.body.number
    })
    // console.log(otpholder);
    if (otpholder.length == 0) return res.status(400).send("You have used an expired OTP");

    const rightotpfind = otpholder[otpholder.length - 1];
    const validuser = await bcrypt.compare(req.body.otp, rightotpfind.otp);

    if (rightotpfind.number === req.body.number && validuser) {
        const user = new User(_.pick(req.body, ["number","email"]));
        const token = user.generateJWT();
        const result = await user.save()
        const otpDelete = await Otp.deleteMany({
            number: req.body.number
        })
        // return res.status(200).send({
        //     message: "User Registration Successfull",
        //     token: token,
        //     data: result
        // })
        res.render('success');
    }
    else {
        // return res.status(400).send("Your OTP was wrong");
        res.redirect('/');
    }


}