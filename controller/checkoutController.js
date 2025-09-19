const Address = require('../Model/Address');
const Checkout = require('../Model/Checkout');

exports.addCheckoutData = async (req, res) => {
    try {
        const UserId = req.user._id;
        const { addressL1, paymentMode, products, name, email, phone } = req.body;
        if (addressL1.length < 15) {
            res.status(400).json({
                message: "Address should be minimum of 15 characters",
                status: false
            });
        }
        const checkoutData = await Checkout.create({
            name,
            email,
            phone,
            addressL1,
            paymentMode,
            user: UserId,
            products: products
        });
        checkoutData.save();
        const existingAddress = await Address.find({ user: UserId, address: addressL1 });

        if (existingAddress.length > 0) {
            console.log("Address already exists for this user.");
        } else {
            const newAddress = await Address.create({
                user: UserId,
                address: addressL1
            });
            newAddress.save();
        }


        res.status(200).json({
            message: "Your Order is Placed Succesfully",
            status: true,
            data: checkoutData
        })
    }
    catch (err) {
        console.log("err", err)
        res.status(400).json({
            message: "Your Order is Not Placed. Please Try Again Later",
            status: false
        })
    }
}

exports.showCheckoutData = async (req, res) => {
    try {
        const UserId = req.user._id;
        const historyData = await Checkout.find({ user: UserId }).populate('products.product');
        if (historyData.length) {
            res.json({
                history: historyData || [],
                status: true,
                message: "Order History Fetched Succesfully"
            })
        }
        else {
            res.json({
                histoy: [],
                status: false,
                message: "No Past Orders"
            })
        }
    } catch (error) {
        console.log("error ", error)
        res.status(400).json({
            histoy: [],
            message: "Unable To Fetch Your Order History. Please Try Again Later",
            status: false
        })
    }
}

exports.GetAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const address = await Address.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(1);

        const alladdress = await Address.find({ user: userId });

        if (!address) {
            return res.json({
                message: "Address Not Found",
                status: 400
            })
        }
        res.json({
            showaddress: address,
            alladdress: alladdress,
            message: "Address Get",
            status: 200
        })
    } catch (error) {
        console.log("error", error)
        res.json({
            error: error,
            message: "Address Not Get",
            status: 500
        })
    }
}

