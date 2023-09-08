const express = require("express");
const {detailStore, selectListRegionStores} = require("../controllers/store");
const {selectListRegions} = require("../controllers/region");
const {isLoggedIn} = require("../middlewares");

const router = express.Router();

router.get("/", isLoggedIn, selectListRegions);
router.post("/", isLoggedIn, selectListRegionStores);

router.get("/detail/:no", isLoggedIn, detailStore);
router.post("/detail/:no", isLoggedIn, detailStore);

module.exports = router;
