const { addReview, showReviews } = require('../controller/reviewController');
const { validateToken } = require('../controller/userController');

const router = require('express').Router();

router.post("/submit-a-review", validateToken, addReview);
router.get("/showReviews/:id", validateToken, showReviews);

module.exports = router;