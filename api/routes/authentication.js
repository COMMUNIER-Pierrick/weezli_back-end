const express = require("express");
const router = express.Router();
const authentication = require("../sources/controllers/authentication");
const passport = require("passport");

router.post("/login", authentication.login);
router.post("/register", authentication.register);
router.get(
	"/special",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
	}
);

module.exports = router;
