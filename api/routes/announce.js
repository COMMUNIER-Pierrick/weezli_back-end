const express = require("express");
const router = express.Router();
const announce = require("../controllers/announce");

router.post("/new-announce", announce.insert);
router.put("/update-announce/:id", announce.update);
router.delete("/remove-announce/:id", announce.remove);

router.get("/announces-by-type/:id_type", announce.getByType);
router.get("/:id", announce.getById)
router.get("/user-announce_by_type/:id", announce.getByUserType);
router.post("/search", announce.getSearch);

module.exports = router
