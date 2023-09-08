const express = require("express");
const router = express.Router();
const {selectListOrder, adminOrder, searchForm} = require('../../controllers/admin/adminOrder')
const {isLoggedIn, whoisAdmin} = require('../../middlewares');

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get("/", isLoggedIn, whoisAdmin, adminOrder);

router.get('/selectList', isLoggedIn, whoisAdmin, selectListOrder);

router.get('/search', isLoggedIn, whoisAdmin, searchForm);

module.exports = router;