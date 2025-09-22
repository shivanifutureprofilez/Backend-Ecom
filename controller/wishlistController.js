const Cart = require("../Model/Cart");
const Product = require("../Model/Product");
const WishList = require("../Model/Wishlist");
const Wishlist = require("../Model/Wishlist");


exports.addToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;
        
        const isProductExists = await Wishlist.findOne({
            product: product_id,
            user: req.user._id
        });

        if (isProductExists) {
            const deleteitem = await WishList.findByIdAndDelete(isProductExists?._id)
        }else{
            const result = new Wishlist({
                product: product_id,
                user: req.user._id,
            });
            const resultsave = await result.save();
            console.log("resultsave",resultsave)
            res.json({
                message: "Product added to wishlist.",
                status: true,
                product : resultsave
            });
        }
        

    } catch (error) {
        console.error("error", error);
        res.status(500).json({
            message: "Product not added to wishlist. Try again later.",
            status: false,
            error: error.message
        });
    }
};

///


exports.showWishlist = async (req, res) => {
    try {
        const user = req.user._id;
        const wishlistData = await Wishlist.find({ user: user }).populate("product").sort({ createdAt: -1 });
        if (wishlistData.length) {
            res.json({
                wishlist: wishlistData || [],
                message: "Fetched All Wishlist Products",
                status: true
            })
        }
        else {
            res.json({
                wishlist: [],
                message: "No Products are there in the wishlist",
                status: false
            })
        }
    } catch (error) {
        res.json({
            message: "No Wishlist Product Found. Something Went Wrong",
            error: error,
            status: false
        })
    }
};

exports.deleteWishlistItem = (async (req, res) => {
    try {
        console.log("req.body",req.body);
        const { _id } = req.body;
        const deletedItem = await WishList.findByIdAndDelete(_id);
        //console.log("isCartProduct",isCartProduct)
        if(deletedItem){
            res.json({
                message:"Product removed from wishlist.",
                status: true
            })
        } else {
            res.json({
                message: "Product failed to remove from wishlist !!",
                status: false,
            })
        }
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Product failed to remove from wishlist. Something went wrong",
            status: false,
            error: error
        })
    }
});