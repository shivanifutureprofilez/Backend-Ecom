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
        const similar_product_id = req.query?.similar_product_id;

        let products_data = [];
        if (similar_product_id) {
            const similarProduct = await Product.findOne({ _id: similar_product_id });
            const similarPrdType = similarProduct?.product_type || '';
            products_data = await Product.checkWishAndCart(userId, similarPrdType);
        } else {
            products_data = await Product.checkWishAndCart(userId);
        }

        if (products_data.length) {
            res.json({
                products: products_data || [],
                message: "Got all products",
                status: true
            })
        } else {
            res.json({
                message: "No products are found",
                status: false,
                products: products_data || [],
            })
        }
    }
    catch (error) {
        console.log("error", error)
        res.json({
            message: "No Products Are Found. Something Went Wrong",
            status: false,
            error: error
        })
    }
})

exports.ProductUpdate = (async (req, res) => {
    try {

        const { id, product_type, price, name, image, content, brand_name } = req.body;
        const productData = await Product.findByIdAndUpdate(id, {
            product_type, price, name, image, content, brand_name
        });
        if (!productData) {
            res.json({
                message: "Product Not Updated",
                status: false,
            })
        }
        res.json({
            message: "Updated Product Sucessfully",
            status: true,
            productData: productData
        })
    } catch (error) {
        res.json({
            message: "Product Not Updated. Try Again Later",
            status: false,
            error: error
        })
    }
})

exports.productDelete = (async (req, res) => {
    try {
        const product_id = req.params.product_id;

        const productData = await Product.findByIdAndUpdate(product_id);
        productData.deletedAt = new Date();
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

exports.showProductDetails = (async (req, res) => {
    try {
        const product_id = req.params.id;
        console.log("product_id", product_id)
        const productData = await Product.findById(product_id).populate('reviews');
        if (!productData) {
            res.json({
                message: "Unable To Fetch Product Details",
                status: false,
            })
        }
        else {
            res.json({
                message: "Fetched Product Details Succesfully",
                productData: productData,
                status: true
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

exports.overviewStats = (async (req, res) => {
    try {
                
        const sofaCount = await Product.countDocuments({ product_type: 'sofa' });
        const tableCount = await Product.countDocuments({ product_type: 'table' });
        const chairCount = await Product.countDocuments({ product_type: 'chair' });
        const lampCount = await Product.countDocuments({ product_type: 'lamp' });
        
        const allstats = {
            "sofa" : sofaCount,
            "table" : tableCount,
            "chair" : chairCount,
            "lamp" : lampCount,
        } 

        res.json({
            message: "OK",
            status: true,
            allstats: allstats,
        })
        
    } catch (error) {
        res.json({
            message: " Try Again Later",
            status: false,
            error: error
        })
    }
})


// exports.showProductType = (async (req,res) => {
//     try {
//         const product_type= req.params.type;
//         console.log("product_type" ,product_type)
//         const productData = await Product.find(product_type);
//         if(!productData){
//             res.json({
//                 message:"Unable To Fetch Product Details",
//                 status:false,
//             })
//         }
//         else{
//             res.json({
//                 message:"Fetched Product Details Succesfully",
//                 productData :productData,
//                 status:true
//             })
//         }
//     } catch (error) {
//         res.json({
//             message: "Unable to fetch Product Details. Try Again Later",
//             status: false,
//             error: error
//         })
//     }
// })

