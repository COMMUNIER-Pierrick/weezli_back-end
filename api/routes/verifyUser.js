const express = require("express");
const router = express.Router();
const verifyUser = require("../controllers/verifyUser");

router.get("/confirm/:confirmCode", verifyUser.emailVerif);
router.get("/:id", verifyUser.getById);

module.exports = router;
