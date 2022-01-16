const mongoose=require('mongoose');
// const Product=require('./Product')

const orderSchema=new mongoose.Schema({
    txnid:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:String,
        require:true,
        min:0
    },
    date:{
        type:Date,
        default:Date.now()
    },
    orderedProducts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
});

const Order=mongoose.model('Order',orderSchema);
module.exports=Order;