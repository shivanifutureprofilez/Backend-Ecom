const { addCheckoutData, userAddress, showCheckoutData, GetAddress } = require('../controller/checkoutController');
const { validateToken } = require('../controller/userController');

const router = require('express').Router();

router.post('/add', validateToken, addCheckoutData);
router.get('/OrderHistory', validateToken, showCheckoutData);


router.get('/address', validateToken, GetAddress);

module.exports = router;