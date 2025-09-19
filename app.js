const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
app.use(express.json());
const cors = require("cors");
const corsOptions = {
    origin: "*", // Allowed all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*", // Allow all headers
    credentials: true,
    optionsSuccessStatus: 200, // for legacy browsers
}; 


app.use(cors(corsOptions));
require('./config');
const userRoutes = require("./routes/usersRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require('./routes/checkoutRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const port = process.env.PORT || 5000;
app.use('/api', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes );
app.use('/api/checkout', checkoutRoutes);
app.use('/api/wishlist', wishlistRoutes)

app.get('/', (req, res) => {
    res.json("Hello world");
})
app.listen(port, () => {
    console.log(`Server Listening ${port}`)
});