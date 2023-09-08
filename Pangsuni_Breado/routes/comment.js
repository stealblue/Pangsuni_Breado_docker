const express = require("express");
const {selectListComment, addComment, selectOneComment,modifyComment} = require("../controllers/comment");

const router = express.Router();

router.get("/selectList/:b_no", selectListComment);
router.get("/selectOne/:c_no", selectOneComment);

router.post('/add2', addComment);
router.post('/modify', modifyComment);

module.exports = router;