const express = require("express");
const router = express.Router();
const transport = require("../controllers/transport");
const {upload} = require("../config/image-config")

router.get("/all-transports", transport.getAll);
router.get("/:id", transport.getById);
router.post("/new-transport",  upload.single('file'), transport.insert);
router.put("/update-transport/:id", transport.update);
router.delete("/remove-transport/:id", transport.remove);

module.exports = router;
