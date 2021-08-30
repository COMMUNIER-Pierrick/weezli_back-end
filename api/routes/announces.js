const express = require("express");
const router = express.Router();
const announces = require("../sources/controllers/announces");
const passport = require("passport");

router.post("/new-announce", announces.add_new_announce);
router.get("/user-announces/:type/:id", announces.get_user_announces);
router.get("/:type", announces.get_all_announce);
router.patch("/update/:type/:id", announces.update_announce);
router.delete(
	"/remove/:type/:id",
	passport.authenticate("jwt", { session: false }),
	announces.delete_announce
);

module.exports = router;
