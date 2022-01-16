const express=require('express');
const router=express.Router();
const Product=require('../models/Product');
const Review=require('../models/reviews');
const isLoggenin = require('./middleware');



router.get('/products',async(req,res)=>{
    const products=await Product.find({});
    res.render('index',{products});
})

router.get('/product/new',isLoggenin,(req,res)=>{
    res.render('products/new');
})
router.post('/products',isLoggenin,async(req,res)=>{
    const product=req.body;

    await Product.create(product);
    req.flash('success','Product has been added successfully');
    res.redirect('/products');
})
router.get('/products/:id',isLoggenin,async(req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id).populate('reviews');
    // console.log(product)

    res.render('products/show',{product});
})

router.get('/products/:id/edit',isLoggenin,async(req,res)=>{
    const {id}=req.params;

    const product=await Product.findById(id);

    res.render('products/edit',{product});
})

router.patch('/products/:id',isLoggenin,async(req,res)=>{
    const {id}=req.params;

    const product=req.body;

    await Product.findByIdAndUpdate(id,product);
    req.flash('success',"Product has been updated successfully");
    res.redirect(`/products/${id}`);
});

router.post('/products/:id/review',isLoggenin,async(req,res)=>{
    const{id}=req.params;
    const{rating,comment}=req.body;
    
    // console.log(rating)
    const review=new Review({rating:rating,comment:comment,user:req.user.username});
    const product=await Product.findById(id);

    product.reviews.push(review);

    review.save();
    product.save();
    req.flash('success',"Thankyou for the Review !");
    res.redirect(`/products/${id}`);
   
    // console.log(review)
    // res.send("got the review and saving it .....")
})

router.delete('/products/:id',isLoggenin,async(req,res)=>{
    const {id}=req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products')
});


router.delete('/products/:productid/review/:reviewid',isLoggenin,async(req,res)=>{
    // console.log("the product will not be deleted this i know but we are just checking");
    // res.send("DELETing........")

    const {productid,reviewid}=req.params;

    await Product.findByIdAndUpdate(productid,{$pull:{reviews:reviewid}})
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/products/${productid}`);

})

module.exports=router;