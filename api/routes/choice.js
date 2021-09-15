const express = require("express");
const router = express.Router();
const choice = require("../controllers/choice");

router.get("/all-choices",  choice.getAll);
router.post("/new-choice", choice.insert);
router.get("/:id", choice.getById);
router.put("/update-choice/:id", choice.update);
router.delete("/remove-choice/:id", choice.remove);

module.exports = router;
