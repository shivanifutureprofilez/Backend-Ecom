const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity: {
        type: Number,
        //default: 1,
        min:1
    },
    createddAt: { 
        type : Date,
        default : Date.now
    }
})

const Cart = mongoose.model('carts', cartSchema);
module.exports = Cart;