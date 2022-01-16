const express=require('express')
const router=express.Router();
const User=require('../models/user.js')
const Product=require('../models/Product.js')
const isLoggenin=require('./middleware')


router.get('/cart/:productid/add',isLoggenin,async(req,res)=>{
    const{productid}=req.params;
    const product=await Product.findById(productid);
    const user=req.user;
    user.cart.push(product);
    await user.save();
    res.redirect('/cart/user');
});

router.get('/cart/user',isLoggenin,async(req,res)=>{
    const userid=req.user._id;
    const user=await User.findById(userid).populate('cart');

    res.render('cart/userproducts',{cart:user.cart});
})

router.delete('/user/:userid/cart/:id',async(req,res)=>{

    try{const {userid,id}=req.params;
    await User.findByIdAndUpdate(userid,{$pull:{cart:id}});
    }
    catch(e){
        req.flash('error',e.message);
        
    }
    res.redirect('/cart/user');
})

module.exports=router;
