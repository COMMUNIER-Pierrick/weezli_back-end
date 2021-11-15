const express = require("express");
const proposition = require("../controllers/proposition");

const router = express.Router();

router.post("/insert", proposition.insert);
router.get("/all-proposition", proposition.getAll);
router.get("/all-proposition-announce-by-id/:id_announce", proposition.getByIdAnnounce);
router.get("/all-proposition-by-user/:id_announce/:id_user", proposition.getByIdAnnounceAndUser);
router.put("/update-proposition/", proposition.update);
router.delete("/remove-proposition/:id", proposition.remove);

module.exports = router;
