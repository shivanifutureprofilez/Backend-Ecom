const { productadd, showProducts, productDelete, ProductUpdate } = require("../controller/productController");
const { validateToken } = require("../controller/userController");

const router = require("express").Router();

router.post("/add-product", productadd);

router.get("/get-product", validateToken, showProducts);

router.get("/delete/:product_id", productDelete);

router.post("/update-product", ProductUpdate);

module.exports = router;


