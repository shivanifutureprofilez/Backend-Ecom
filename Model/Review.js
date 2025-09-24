const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const reviewSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    name:{
        type:String,
        required:[true, "Your name is Required"],
    },
    email:{
        type:String,
        required:[true, "Your email is Required"],
    },
    review:{
        type:String,
        required:[true, "Your Review is Required"],
    },
    rating:{
        type:Number,
        required:[true, "Your Rating is Required"],
    }
},
    { timestamps: true }

)

const Review = mongoose.model('reviews', reviewSchema);
module.exports = Review;