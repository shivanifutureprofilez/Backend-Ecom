const Cart = require("../Model/Cart");
const WishList = require("../Model/Wishlist");

exports.addToCart = (async (req, res) => {
    try {
        const { product_id, qty, wishlist } = req.body;  
        if(!req.user){
             res.json({
                message: "You must have to login first.",
                status: false
            })
        }

        const isProductExists = await Cart.findOne({product:product_id});
        if(isProductExists){
            isProductExists.quantity = (isProductExists.quantity)+1
            const data = await isProductExists.save();

            if(wishlist ==1 ){ 
                    const item =  await WishList.findOne({product:product_id });
                    if(item){
                        const deletedItem =  await WishList.findByIdAndDelete(item?._id);
                    } 
            }

            if(data){
                    res.json({
                        message: "Product quantity increased.",
                        status: true
                    })
            } else {
                res.json({
                    message: "Failed to update product quantity",
                    status: false,
                    error: data
                })
            }
        } else { 
            const result = new Cart({
                product : product_id,
                user : req.user._id,
                quantity : qty 
            });
            const data = await result.save();
            if (data?._id) {
                res.json({
                    message: "Product added to cart.",
                    status: true
                })
            } else {
                res.json({
                    message: "Failed to add to cart.",
                    status: false,
                    error: data
                })
            }
        }

    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Product not added in cart",
            status: false,
            error: error
        })
    }
});

exports.updateCart = (async (req, res) => {
    try {
        const { product_id, qty } = req.body;
        const isProductExists = await Cart.findOne({product:product_id});

        if(isProductExists){
            isProductExists.quantity = qty
            const data = await isProductExists.save();
            if(data){
                    res.json({
                        message: "Product quantity increased.",
                        status: true
                    })
            } else {
                res.json({
                    message: "Failed to update product quantity",
                    status: false,
                    error: data
                })
            }
        } else { 
            res.json({
                message: "Product not found !!",
                status: false,
                error: data
            })
        }
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Product update failed.",
            status: false,
            error: error
        })
    }
});

exports.deleteCartItem = (async (req, res) => {
    try {
        const { id } = req.body;
        const isProductDeleted = await Cart.findByIdAndDelete(id);
        if(isProductDeleted){
            res.json({
                message: "Product removed from cart.",
                status: true
            }) 
        } else { 
            res.json({
                message: "Product failed to remove !!",
                status: false,
            })
        }
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Product failed to remove. Something went wrong",
            status: false,
            error: error
        })
    }
});

exports.cartListing = (async (req, res) => {
    try {
        // Cart.find({user:req.user?._id}).populate(["user", "product"])
        const lists = await Cart.find({user:req.user?._id}).populate(["user", "product"]);
        console.log("lists" ,lists)
        if (lists.length > 0) {
            res.json({
                message: "Fetched .",
                lists: lists,
                status: true
            })
        } else {
            res.json({
                message: "Failed to add to cart.",
                status: false,
                lists: []
            })
        }
    } catch (error) {
        res.json({
            message: "Product not added in cart",
            status: false,
            lists: []
        })
    }
});

exports.emptyCart = (async (req,res) => {
    try {
        const {id} = req.body;
        const emptyCart = await Cart.findByIdAndDelete({_id : id});
        if(emptyCart){
            res.json({
                message:"Cart Is Empty",
                status:true  
            })
        }
        else{
            res.json({
                message:"Not able to empty Cart",
                status:false
            })
        }
    } catch (error) {
        res.json({
            message:"Not able to empty cart. Something Went Wrong",
            status:false,
            error:error
        })
    }
});

