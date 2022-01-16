const isLoggenin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You need to Login first');
        res.redirect('/login');
    }
    next();
}


module.exports=isLoggenin;