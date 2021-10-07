const express = require("express");
const router = express.Router();
const size = require("../controllers/size");
const {upload} = require("../config/image-config");

router.get("/all-sizes", size.getAll);
router.get("/:id", size.getById);
router.post("/new-size",  upload.single('file'), size.insert);
router.put("/update-size/:id",  upload.single('file'), size.update);
router.delete("/remove-size/:id", size.remove);

module.exports = router;
