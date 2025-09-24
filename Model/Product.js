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
    // quantity: {
    //     type: Number,
    //     required:[true, 'Quantity is Required']
    // },
    image: {
        type: String,
        required: [true, 'Image is Required']
    },
    deletedAt: { 
        type : Date,
    }
})
 

productSchema.statics.checkWishAndCart = async function (userId, type = null) {
   let products = []
    if(type){
       products = await this.find({product_type: type}).lean();
    } else { 
       products = await this.find({}).lean();
  }
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

  const newupdatedproducts =  products.map(p => ({
    ...p,
    isWishlisted: wishlistIds.includes(p._id.toString()),
    isCartAdded: cartIdes.includes(p._id.toString())
  }));

  // [a-1-wish-true, b-2-wish-false, c-3-wish-f, d-4-wish-true]


  return newupdatedproducts;
  
  
};


const Product = mongoose.model('products', productSchema);
module.exports = Product;