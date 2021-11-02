const express = require("express");
const status_proposition = require("../controllers/status_proposition");
const router = express.Router();

router.get("/all-status-proposition", status_proposition.getAll);
router.get("/:id", status_proposition.getById);
router.post("/new-status-proposition", status_proposition.insert);
router.put("/update-status-proposition/:id", status_proposition.update);
router.delete("/remove-status-proposition/:id", status_proposition.remove);

module.exports = router;
