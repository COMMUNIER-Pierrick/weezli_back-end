const express = require("express");
const router = express.Router();
const size = require("../controllers/size");

router.get("/all-sizes", size.getAll);
router.get("/:id", size.getById);
router.post("/new-size", size.insert);
router.put("/update-size/:id", size.update);
router.delete("/remove-size/:id", size.remove);

module.exports = router;
