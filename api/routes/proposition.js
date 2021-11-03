const express = require("express");
const proposition = require("../controllers/proposition");

const router = express.Router();

router.post("/insert", proposition.insert);
router.get("/all-proposition", proposition.getAll);
router.get("/all-proposition-announce-by-id/:id_announce", proposition.getByIdAnnouce);
router.get("/all-proposition-by-user/:id_announce/:id_user", proposition.getByIdAnnouceAndUser);
router.put("/update-proposition/:id", proposition.update);
router.delete("/remove-proposition/:id", proposition.remove);

module.exports = router;
