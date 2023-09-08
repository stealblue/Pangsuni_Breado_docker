const express = require("express");
const {selectOneProduct, addProduct, listProduct, modProduct, editProduct, deleteProduct, testAxios} = require('../controllers/product');
const {productRegExp} = require('../middlewares/regExpCheck');
const {isLoggedIn} = require('../middlewares/index');
const {upload} = require('../middlewares/uploads');

const router = express.Router();

router.get('/', isLoggedIn, listProduct); // 상품 리스트 화면으로 이동

router.get('/add', isLoggedIn, selectOneProduct); // 상품 추가 화면으로 이동
router.post('/add', upload.fields('p_img'), addProduct);// 상품 추가 화면에서 리스트로 이동


router.get('/modify/:p_no', isLoggedIn, modProduct); // 상품 정보 수정 화면으로 이동
router.post('/modify', isLoggedIn, productRegExp, editProduct); // 상품 정보 수정화면에서 리스트로 이동

router.get('/delete/:p_no', isLoggedIn, deleteProduct); // 상품 정보 수정 화면으로 이동

router.post('/test', upload.single('p_img'), testAxios);

module.exports = router;