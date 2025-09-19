// const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const bycrypt = require('bcrypt');
const Address = require("../Model/Address");

exports.validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    // Token format: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: false, message: "Token missing" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET,  async (err, decoded) => {
      if (err) {
        return res.status(403).json({ status: false, message: "Invalid or expired token" });
      }
      const user = await User.findById(decoded.userId);
      console.log("user",decoded)
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};


const signToken = (user_id) => {
    const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
    return token; 
}

exports.signup = async (req, res) => {
    try {
        const { name, email, password ,phone } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            const userData = await User.create({
                name,
                email,
                password ,
                phone
            })
            userData.save();
            res.status(200).json({
                message: "User Registered Succesfully",
                status: true,
                user: userData
            })
        }
        res.status(401).json({
            "message": "User already Exists",
            status: false,
        })
    }
    catch (err) {
        res.status(500).json({ message: err?.message || "Something went wrong",
            status: false
         });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                status: false,
                message: "Email and password are required"
            })
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.json({
                status: false,
                message: "User not found"
            })
        }

        const actualUser = await User.findOne({ email });
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }
        const token = signToken(user._id);
        res.status(200).json({
            "message": "User Logged In Succesfully",
            "user": actualUser,
            "token": token,
            "status": true,
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.myprofile = async (req, res) => {
    try {
        res.status(200).json({
            "message": "User Logged In Succesfully",
            "user": req?.user || null,
            "status": true,
        })
    }
    catch (error) {
        res.status(500).json({ 
            "message": error.message ,
            "status": false
        })
    }
}
