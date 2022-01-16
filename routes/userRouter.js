const express = require("express");

const router=express.Router();
const {signUp,verifyOtp}=require('../Controllers/userController')


router.get('/loginwithotp',(req,res)=>{
    // res.send("hello");
    res.render('loginwithotp');
})
router.get('/signup/verify/:number/:email',(req,res)=>{
    // res.send("hello");
    const {number,email}=req.params;
    res.render('verifywithotp',{number,email});
})

router.route('/signup').post(signUp);
router.route('/signup/verify').post(verifyOtp);

module.exports=router;

