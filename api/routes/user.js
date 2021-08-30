const express = require("express");
const router = express.Router();
const user = require("../sources/controllers/user");
const passport = require("passport");

router.patch(
	"/update",
	passport.authenticate("jwt", { session: false }),
	user.updateUser
);
router.get(
	"/me",
	passport.authenticate("jwt", { session: false }),
	user.getMyInfo
);
router.get(
	"/info/:id",
	passport.authenticate("jwt", { session: false }),
	user.getUserInfo
);

module.exports = router;
