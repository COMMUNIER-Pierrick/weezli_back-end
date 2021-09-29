const express = require("express");
const {upload} = require("../config/image-config")
const router = express.Router();
const image = require("../controllers/image");

router.post("/singleFile", upload.single('file'), image.singleFileUpload);

router.post("/deleteFile", image.deleteFile);

module.exports = router;

