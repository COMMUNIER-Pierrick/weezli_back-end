const express = require("express");
const opinion = require("../controllers/opinion");
const router = express.Router();

router.get("/:id", opinion.getById);
router.get("/get-all-opinion-user/:idUser", opinion.getAllOpinionByUser);
router.get("/get-all-opinion-received-user/:idUser", opinion.getAllOpinionReceivedByUser);
router.get("/get-opinion-user-by-user/:idLivreur/:idExpediteur", opinion.getOpinionUserByUser);
router.post("/insert-opinion", opinion.insert);
router.put("/update-opinion", opinion.update);
router.delete("/remove-opinion/:id", opinion.remove);

module.exports = router;
