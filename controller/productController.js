const Product = require("../Model/Product");
const WishList = require("../Model/Wishlist");

exports.productadd = (async (req, res) => {
    try {
        const { name, content, image, product_type, brand_name, price } = req.body;

        if (!name || !content || !image || !product_type || !brand_name || !price) {
            res.json({
                message: "All fields required",
                status: false
            })
        }
        const result = new Product({
            name, content, image, product_type, brand_name, price
        })
        const data = await result.save();
        if (data?._id) {
            res.json({
                message: "Product Added Successfully",
                status: true
            })
        } else {
            res.json({
                message: "Failed to add product.",
                status: false,
                error: data
            })
        }
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Product not added",
            status: false,
            error: error
        })
    }
});


exports.showProducts = (async (req, res) => {
    try {
        const userId = req?.user?._id;
        const products = await Product.checkWishAndCart(userId);
         
         if (products.length) {
            res.json({
                products: products || [],
                message: "Got all products",
                status: true
            })
        } else {
            res.json({
                message: "No products are found",
                status: false,
                products: products || [],
            })
        }
    }
    catch (error) {
        res.json({
            message: "No Products Are Found. Something Went Wrong",
            status: false,
            error: error
        })
    }
})

exports.ProductUpdate = (async (req, res) => {
    try {
        const { _id, name, brand_name, price, content } = req.body;
        const productData = await Product.findByIdAndUpdate(_id, {
            name, brand_name, price, content
        }, { new: true, runValidators: true })
        if (!productData) {
            res.json({
                message: "Not User Found",
                status: false,
            })
        }
        res.json({
            message: "Update Product Sucess",
            status: true,
            productData: productData
        })
    } catch (error) {
        res.json({
            message: "Product Not Update. Try Again Later",
            status: false,
            error: error
        })
    }
})

exports.productDelete = (async (req, res) => {
    try {
        const product_id = req.params.product_id;

        const productData = await Product.findByIdAndUpdate(product_id);
        productData.deletedAt =  new Date();
        productData.save();

        if (!productData) {
            res.json({
                message: "Product Not Deleted.",
                status: false,
            })
        }
        res.json({
            message: "Deleted Sucessfully",
            status: true,
        })
    } catch (error) {
        res.json({
            message: "Product Not Deleted. Try Again Later",
            status: false,
            error: error
        })
    }
})

exports.showProductDetails = (async (req,res) => {
    try {
        const product_id = req.params.id;
        console.log("product_id" ,product_id)
        const productData = await Product.findById(product_id);
        if(!productData){
            res.json({
                message:"Unable To Fetch Product Details",
                status:false,
            })
        }
        else{
            res.json({
                message:"Fetched Product Details Succesfully",
                productData :productData,
                status:true
            })
        }
    } catch (error) {
        res.json({
            message: "Unable to fetch Product Details. Try Again Later",
            status: false,
            error: error
        })        
    }
})

