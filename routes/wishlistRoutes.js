const router = require("express").Router();
const { validateToken } = require("../controller/userController");
const { addToWishlist, showWishlist, deleteWishlistItem } = require("../controller/wishlistController");

router.post("/add-to-wishlist", validateToken, addToWishlist);
router.get("/wishlist",validateToken, showWishlist);
router.post("/removeWishlistItem",validateToken, deleteWishlistItem)

module.exports = router;
