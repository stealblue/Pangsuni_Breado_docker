const express = require("express");
const {deleteComment} = require("../../controllers/admin");
const router = express.Router();
const {
    addFormBoard,
    adminModifyBoard,
    adminModifyBoardPost,
    adminBoard,
    adminSelectListBoard,
    deleteBoard,
    selectOneBoard
} = require('../../controllers/admin/adminBoard');
const {isLoggedIn, whoisAdmin} = require("../../middlewares");

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get("/", isLoggedIn, whoisAdmin,adminBoard); // 화면이동

router.get("/selectList", isLoggedIn, whoisAdmin,adminSelectListBoard); // axios를 이용한 비동기 (이름 바꿔야함)

router.get("/selectOne/:b_no", isLoggedIn, whoisAdmin,selectOneBoard); // axios를 이용한 비동기 (이름 바꿔야함)

router.get("/add", isLoggedIn, whoisAdmin, addFormBoard);

router.post("/delete", isLoggedIn, whoisAdmin,deleteBoard);

router.get("/modify/:b_no", isLoggedIn, whoisAdmin,adminModifyBoard);
router.post("/modify", isLoggedIn, whoisAdmin,adminModifyBoardPost);

router.post('/comment/delete', deleteComment);

module.exports = router;