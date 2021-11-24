const express = require("express");
const opinion = require("../controllers/opinion");
const order = require("../controllers/order");
const router = express.Router();

router.get("/:id", opinion.getById);
router.get("/get-all-opinion-user/:idUser", order.getAllOpinionByUser);
router.get("/get-opinion-order/:idOrder", opinion.getOpinionByOrder);
router.get("/get-opinion-user-by-user/:idLivreur/:idExpediteur", opinion.getOpinionUserByUser);
router.post("/insert-opinion", opinion.insert);
router.put("/update-opinion/:id", opinion.update);
router.delete("/remove-opinion/:id", opinion.remove);

module.exports = router;
