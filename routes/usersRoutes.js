const router = require("express").Router();

const {signup, login, validateToken, myprofile} = require("../controller/userController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/myprofile", validateToken, myprofile);
// router.get("/allUsers",  getUsers);

module.exports = router;