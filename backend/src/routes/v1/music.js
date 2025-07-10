const router = require("express").Router();
const { YTMusicController } = require("../../controllers");

router.get("/stream/:id", YTMusicController.getMusicStreamingInfo);

module.exports = router;
