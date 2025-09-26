const Review = require("../Model/Review");


exports.addReview = (async (req,res) => {
try {
        const { review, rating, product_id } = req.body;

        console.log("req.user",req.user)
        if ( !review || !rating) {
            res.json({
                message: "All fields are required",
                status: false
            })
        }
        const result = new Review({
             review, 
             rating,
             product:product_id,
             name : req?.user?.name || null,
            email: req?.user?.email || null
        })
        const data = await result.save();
        if (data?._id) {
            res.json({
                message: "Review Added Successfully",
                status: true
            })
        } else {
            res.json({
                message: "Failed to add Review.",
                status: false,
                error: data
            })
        }
    } catch (error) {
        console.log("error", error)
        res.json({
            message: "Failed To Add Review. Please Try Again Later.",
            status: false,
            error: error
        })
    }
})

exports.showReviews = (async (req,res) => {
    try {
        const productId = req?.params?.id;
        const reviewData = await Review.find({product: productId});
        console.log("review Data : ",reviewData)
        if(reviewData.length){
            res.json({
                reviews: reviewData || [],
                status:true,
                message: "Successfully Fetched All Reviews For This Product"
            })
        }
        else{
            res.json({
                reviews: [],
                status:false,
                message:"No review found !!"
            })
        }
    } catch (error) {
        res.json({
            message:"Unable To Fetch All Reviews. Something Went Wrong",
            status:false,
            error:error
        })
    }
})



