const express = require("express");
const router = express.Router();
const announce = require("../controllers/announce");

router.post("/new-announce", announce.insert);
router.put("/update-announce/:id", announce.update);
router.delete("/remove/:id", announce.remove);

router.get("/announces-by-type/:type", announce.getByType);
router.get("/:id", announce.getById)
router.get("/user-announce", announce.getByUser);
router.get("/user-announce/:type", announce.getByUserType);

module.exports = router
