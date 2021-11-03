const express = require("express");
const router = express.Router();
const order = require("../controllers/order");

router.post("/new-order", order.insert);
router.put("/update-order/:id", order.updateStatus);
router.delete("/remove-order/:id", order.remove);

router.get("/:id", order.getById);
router.get("/deliveries/:idUserP/:idUserU/:id_status", order.getOrdersByUserAndStatus);
router.get("/orders/:idUserP/:idUserU", order.getOrdersByUser);


module.exports = router;