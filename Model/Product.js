const mongoose = require('mongoose');
const WishList = require('./Wishlist');
const Cart = require('./Cart');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Name is Required'],
    },
    content: {
        type: String,
        required: [true, 'content Name is Required'],
    },
    product_type: {
        type: String,
        required: [true, 'Product Type is Required'],
        enum: ['interior', 'chair', 'table', 'lamp', 'sofa']
    },
    brand_name: {
        type: String,
        required: [true, 'Brand Name is Required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is Required'],
    },
    stock: {
        type: Number,
        default: 10
    },
    image: {
        type: String,
        required: [true, 'Image is Required']
    },
    deletedAt: {
        type: Date,
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.virtual('reviews', {
    ref: 'reviews',
    localField: '_id',    // Product._id
    foreignField: 'product',
});

productSchema.virtual('product_rating').get(function () {
    if (!this.reviews || this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    return +(sum / this.reviews.length).toFixed(1);
});

// productSchema.virtual('product_rating').get(function () {
//     return "hsjdhfjsd"
// });


productSchema.statics.checkWishAndCart = async function (userId, type = null) {
    let productsQuery = type ? this.find({ product_type: type }) : this.find({});

    let products = await productsQuery
        .populate('reviews');       

    // [a-1, b-2- c-3-f, d-4]

    const wishlist = await WishList.find({ user: userId }).select("product");
    // [a, d]

    const wishlistIds = wishlist.map(w => w.product.toString());
    // [1, 4]

    // check for cart
    const cart = await Cart.find({ user: userId }).select("product");
    // [a, d]
    const cartIdes = cart.map(w => w.product.toString());
    // [1, 4]

    const newupdatedproducts = products.map(p => ({
        ...p.toJSON(),
        isWishlisted: wishlistIds.includes(p._id.toString()),
        isCartAdded: cartIdes.includes(p._id.toString())
    }));

    // [a-1-wish-true, b-2-wish-false, c-3-wish-f, d-4-wish-true]
    return newupdatedproducts;


};


const Product = mongoose.model('products', productSchema);
module.exports = Product;