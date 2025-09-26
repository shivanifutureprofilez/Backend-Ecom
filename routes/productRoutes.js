const {overviewStats, productadd, showProducts, productDelete, ProductUpdate, showProductDetails, showProductType } = require("../controller/productController");
const { validateToken } = require("../controller/userController");

const router = require("express").Router();

router.post("/add-product", productadd);

router.get("/get-product", showProducts);

router.get("/product-detail/:id", showProductDetails);
// router.get("/get-product-type/:product_type", showProductType);


router.get("/delete/:product_id", productDelete);

router.post("/update-product", ProductUpdate);
router.get("/get-stats", overviewStats);

module.exports = router;


