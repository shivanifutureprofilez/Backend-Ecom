const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    address: 
    {
        type: String,
        minlength: [15, 'Address must be at least 15 characters long'],
        //maxlength: [50, 'Address can be at most 50 characters long'],
        required: [true, 'Address is Required']
    },
}, {timestamps :true}
)

module.exports = mongoose.model('address', addressSchema);