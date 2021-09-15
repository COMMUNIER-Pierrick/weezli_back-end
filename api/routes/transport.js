const express = require("express");
const router = express.Router();
const transport = require("../controllers/transport");

router.get("/all-transports", transport.getAll);
router.get("/:id", transport.getById);
router.post("/new-transport", transport.insert);
router.put("/update-transport/:id", transport.update);
router.delete("/remove-transport/:id", transport.remove);

module.exports = router;
