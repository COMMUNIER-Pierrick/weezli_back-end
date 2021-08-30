const express = require("express");
const router = express.Router();
const colis = require("../sources/controllers/colis");
const passport = require("passport");

router.post("/new-colis", colis.add_colis);
router.get("/colis/:id", colis.get_one_colis);
router.get("/all-colis", colis.get_all_colis);
router.patch("/update-colis/:id", colis.update_colis);
router.delete(
	"/remove-colis/:id",
	//passport.authenticate("jwt", { session: false }),
	colis.delete_colis
);

module.exports = router;