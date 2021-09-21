const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

router.post("/register", user.insert);
router.post("/login", user.login);
router.delete("/remove-user/:id", user.remove);
router.put("/update-profile/:id", user.update);
router.delete("/logout", user.logout);

router.get("/:id", user.getById);

module.exports = router;
