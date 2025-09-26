const Address = require('../Model/Address');
const Checkout = require('../Model/Checkout');
const Product = require('../Model/Product');

exports.addCheckoutData = async (req, res) => {
    try {
        const UserId = req.user._id;
        const { addressL1, paymentMode, products, name, email, phone } = req.body;

        if (!addressL1 || addressL1.length < 15) {
            return res.status(400).json({
                message: "Address should be minimum of 15 characters",
                status: false
            });
        }

        console.log("products",products);

        for (const item of products) {
            const product = await Product.findById(item.product); 
            if (!product) {
                return res.status(400).json({
                    message: `${product.name} not available`,
                    status: false
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} is Out Of Stock.`,
                    status: false
                });
            }
            product.stock = Number(product.stock) - Number(item.quantity);
            await product.save();
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

        

        const existingAddress = await Address.findOne({ user: UserId, address: addressL1 });
        if (!existingAddress) {
            await Address.create({
                user: UserId,
                address: addressL1
            });
        }

        res.status(200).json({
            message: "Your Order is Placed Successfully",
            status: true,
            data: checkoutData
        });

    } catch (err) {
        console.error("err", err);
        res.status(400).json({
            message: "Your Order is Not Placed. Please Try Again Later",
            status: false
        });
    }
};


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

