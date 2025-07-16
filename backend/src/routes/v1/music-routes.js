const router = require("express").Router();
const { YTMusicController } = require("../../controllers");
const { asyncRouteHandler } = require("../../middlewares");

router.get(
    "/stream/:id",
    asyncRouteHandler(YTMusicController.getMusicStreamingInfo)
);

router.get(
    "/searchSuggestions",
    asyncRouteHandler(YTMusicController.getSearchSuggestions)
);

router.get("/songs", asyncRouteHandler(YTMusicController.getMusics));

router.get("/playlists", asyncRouteHandler(YTMusicController.getPlaylists));
router.get(
    "/playlists/:playlistId",
    asyncRouteHandler(YTMusicController.getPlaylistInfo)
);

router.get(
    "/relatedSongs/:currentSongId",
    asyncRouteHandler(YTMusicController.getNextMusic)
);

router.get(
    "/lyrics/:musicId",
    asyncRouteHandler(YTMusicController.getMusicLyrics)
);

module.exports = router;
