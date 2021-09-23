const express = require("express");
const status = require("../controllers/status");
const router = express.Router();

router.get("/all-status", status.getAll);
router.get("/:id", status.getById);
router.post("/new-status", status.insert);
router.put("/update-status/:id", status.update);
router.delete("/remove-status/:id", status.remove);

module.exports = router;
