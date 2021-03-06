const express = require("express");
const router = express.Router();
const announce = require("../controllers/announce");
const {upload} = require("../config/image-config");

router.post("/new-announce",  upload.any('fileOne', 'fileTwo', 'fileThree', 'fileFour', 'fileFive'), announce.insert);
router.put("/update-announce/:id", upload.any('fileOne', 'fileTwo', 'fileThree', 'fileFour', 'fileFive'), announce.update);
router.delete("/remove-announce/:id", announce.remove);

router.get("/announces-by-type/:id_type/:id_user", announce.getByTypeConnect);
router.get("/announces-by-type/:id_type", announce.getByTypeDisconnect);
router.get("/:id", announce.getById)
router.get("/all-user/:id", announce.getALLUser);
router.post("/search", announce.getSearch);

module.exports = router
