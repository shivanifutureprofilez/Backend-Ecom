const router = require("express").Router();
const { addToCart, cartListing, updateCart, deleteCartItem, emptyCart } = require("../controller/cartController");
const { validateToken } = require("../controller/userController");

router.post("/add-to-cart", validateToken, addToCart);

router.post("/updateCart", validateToken, updateCart);

router.get("/all_carts_items", validateToken, cartListing);

router.post("/deleted_cart_items", deleteCartItem);

router.post("/emptyCart", emptyCart);

module.exports = router;


