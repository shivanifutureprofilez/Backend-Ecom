const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is required",
        max: 25,
    },
    email: {
        type: String,
        required: "Email is required",
        unique: true,
        lowercase: true,
        trim: true,  
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: Number,
        required: [true, "Phone Number is Required"],
        min: 10
    },
    isAdmin: {
        type: Number,
    }, 
    password: {
        type: String,
        required: "Password is required",
        select: false,
        max: 25,
    },
    hashGenerated : {
        type: Boolean, 
        default : false
    }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }
    try{
        console.log("Password before hashing:", this.password);
        this.password = await bycrypt.hash(this.password, 10);
        this.hashGenerated = true;
        console.log("Password after hashing:", this.password);
        next();
    }
    catch(err){
        next(err);
    }
});



const User = mongoose.model('users', userSchema);
module.exports = User;

