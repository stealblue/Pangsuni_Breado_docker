const express = require("express");
const router = express.Router();
const {
    product,
    formProduct,
    addProduct,
    selectListProduct,
    deleteProduct,
    modifyFormProduct,
    modifyProduct
} = require("../../controllers/admin/adminProduct");
const {isLoggedIn, whoisAdmin} = require('../../middlewares/index');
const {upload} = require('../../middlewares/uploads');
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', isLoggedIn, whoisAdmin, product);

router.get('/add', isLoggedIn, whoisAdmin, formProduct);
router.post('/add', isLoggedIn, whoisAdmin, addProduct);

router.get('/selectList', isLoggedIn, whoisAdmin, selectListProduct);

router.post('/delete', isLoggedIn, whoisAdmin, deleteProduct);

router.get('/modify/:p_no', modifyFormProduct);
router.post('/modify', isLoggedIn, whoisAdmin, upload.single('p_img'), modifyProduct);

module.exports = router;