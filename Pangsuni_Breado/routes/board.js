const express = require("express");
const router = express.Router();
const {isLoggedIn} = require('../middlewares/index')
const {
    selectListBoard,
    addBoard,
    formBoard,
    selectOneBoard,
    CommentView,
    CommentWrite,
    CommentAdd,
    deleteBoard,
    selectListBoard2,
    modifyFormBoard,
    modifyBoard,
} = require("../controllers/board");
const {modifyFormProduct, modifyProduct} = require("../controllers/admin/adminProduct");
const {upload} = require("../middlewares/uploads");

router.get("/list/:bt_no", selectListBoard);
router.post("/", selectListBoard);

router.get("/qnaadd/:bt_no",isLoggedIn, formBoard);
router.post("/add",isLoggedIn, addBoard);
router.get("/view/:no",selectOneBoard);

router.get("/delete/:b_no", deleteBoard);
router.post("/delete/:b_no", deleteBoard);

router.get("/modify/:b_no", modifyFormBoard);
router.post("/modify", modifyBoard);

router.get("/commentsview/:no", CommentView);
router.post("/commentsview/:no", CommentAdd);

router.post("/commentswrite", CommentWrite);

router.get("/selectList2/:bt_no", selectListBoard2); // 게시판 리스트로이동

module.exports = router;
