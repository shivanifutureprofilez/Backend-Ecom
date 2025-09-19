const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    phone: {
        type: Number,
        required: [true, 'Phone is required']
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    addressL1: {
        type: String,
        minlength: [15, 'Address must be at least 15 characters long'],
        //maxlength: [50, 'Address can be at most 50 characters long'],
        required: [true, 'Address is Required']
    },
    paymentMode: {
        type: String,
        enum: ['cod', 'card'],
        required: [true, 'Mode Of Payment is Required']
    },
    status: {
        type: Number,
        default: 0
        // 0  pending / 1 delivered 2 failed
    },
    deletedAt: {
        type: Date
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('checkouts', checkoutSchema);
