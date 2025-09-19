const mongoose = require('mongoose');
const WishList = require('./Wishlist');

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
        required: [true, 'Product Type is Required'] ,
        enum:['interior','chair','table', 'lamp', 'sofa']
    },
    brand_name: {
        type: String,
        required: [true, 'Brand Name is Required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is Required'],
    },
    quantity: {
        type: Number,
        required:[true, 'Quantity is Required']
    },
    image: {
        type: String,
        required: [true, 'Image is Required']
    },
    deletedAt: { 
        type : Date,
    }
})

productSchema.statics.withWishlistForUser = async function (userId) {
  const products = await this.find({}).lean();
  const wishlist = await WishList.find({ user: userId }).select("product");
  const wishlistIds = wishlist.map(w => w.product.toString());

  return products.map(p => ({
    ...p,
    isWishlisted: wishlistIds.includes(p._id.toString())
  }));
};


const Product = mongoose.model('products', productSchema);
module.exports = Product;