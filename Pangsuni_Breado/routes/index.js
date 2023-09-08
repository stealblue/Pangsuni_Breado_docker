const express = require("express");
const { join, login, logout, idCheck, emailCheck, telCheck } = require("../controllers/auth");
const { renderJoin, renderMain, renderLogin, main } = require("../controllers/page");

const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/", renderMain);
router.post("/",main);

router.get("/login",isNotLoggedIn, renderLogin);
router.post("/login",isNotLoggedIn, login);

router.get("/join", isNotLoggedIn, renderJoin);
router.post("/join", isNotLoggedIn, join);

router.post("/idCheck", idCheck);

router.post("/emailCheck", emailCheck);

router.post("/telCheck", telCheck);

router.get("/logout", isLoggedIn, logout);

module.exports = router;
