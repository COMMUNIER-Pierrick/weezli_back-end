const express = require("express");
const router = express.Router();
const order = require("../controllers/order");

router.post("/new-order", order.insert);

router.get("/:id", order.getById);


module.exports = router;