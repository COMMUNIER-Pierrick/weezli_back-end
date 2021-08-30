const express = require("express");
const router = express.Router();
const formules = require("../sources/controllers/formules");
const passport = require("passport");

router.post("/new-formule", formules.add_formule);
router.get("/formule/:id", formules.get_one_formule);
router.get("/all-formules", formules.get_all_formules);
router.patch("/update-formule/:id", formules.update_formule);
router.delete(
	"/remove-formule/:id",
	//passport.authenticate("jwt", { session: false }),
	formules.delete_formule
);

module.exports = router;
