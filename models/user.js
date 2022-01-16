const mongoose=require('mongoose');
const passportlocalmongoose=require('passport-local-mongoose');
const Product = require('./Product');
const jwt = require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'

        }
    ],
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Order'
        }
    ],number: {
        type: String,
        required: true
    }
}, { timestamps: true, });
userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        number: this.number
    }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    return token;
}



userSchema.plugin(passportlocalmongoose);
const User=mongoose.model('User',userSchema);
module.exports=User;