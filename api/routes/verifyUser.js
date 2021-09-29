const express = require("express");
const router = express.Router();
const verifyUser = require("../controllers/verifyUser");

router.get("/confirm/:confirmCode", verifyUser.emailVerif);

module.exports = router;
