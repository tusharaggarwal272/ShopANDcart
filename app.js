if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const seedDB=require('./seed')
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log("DB Not connected");
    console.log(err.message);
})



// app.get('/products',async(req,res)=>{
//     const products=await Products.find({});
//     res.render('index',{products})
// })

const productRoutes=require('./routes/productRoutes');
const authRoutes=require('./routes/authRoutes');
const cartRoutes=require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const userRoutes=require('./routes/userRouter');
// const { strategies } = require('passport/lib');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
const sessionConfig={
    secret:'theownerofthisprojectisTushar',
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionConfig));
app.use(flash());
// seedDB();

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})
app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.get('/error',(req,res)=>{
    res.render('error');
})


app.use(productRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use('/api/user',userRoutes);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running at port 3000");
})