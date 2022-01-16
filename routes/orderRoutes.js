const express = require('express');
const router = express.Router();
const isLoggenin = require('./middleware');
const User = require('../models/user');


router.get('/user/:userid/me', isLoggenin, async (req, res) => {
    try {
        const { userid } = req.params;

        const userinfo = await User.findById(userid).populate({
            path: 'orders',
            populate: {
                path: 'orderedProducts',
                model: 'Product'
            }
        })

        res.render('orders/myorder', { orders: userinfo.orders });
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', "Cannot Place the Order at this moment.Please try again later!");
        res.render('error');
    }
})





module.exports = router;
