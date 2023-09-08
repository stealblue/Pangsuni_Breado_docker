const express = require("express");
const router = express.Router();
const {
    adminStore,
    selectListStore,
    deleteStore,
    selectOneStore,
    addStore,
    addStore2,
    modifyStore
} = require("../../controllers/admin/adminStore");
const {isLoggedIn, whoisAdmin} = require('../../middlewares/index');
const {upload} = require('../../middlewares/uploads');
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get("/", adminStore);

router.get('/selectList', isLoggedIn, whoisAdmin, selectListStore);

router.get('/selectOne/:s_no', isLoggedIn, whoisAdmin, selectOneStore);

router.post('/delete', isLoggedIn, whoisAdmin, deleteStore);

router.get('/add', isLoggedIn, whoisAdmin, addStore);
router.post('/add', isLoggedIn, whoisAdmin, upload.single('s_img'), addStore2);

router.post('/modify', isLoggedIn, whoisAdmin, upload.single('s_img'), modifyStore);

module.exports = router;