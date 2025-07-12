const { InnertubeService } = require("../services");
const { successResponse } = require("../utils");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
const { Request, Response } = require("express");

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getMusicStreamingInfo = async function (req, res) {
    const videoId = req.params?.id;
    if (!videoId)
        throw new AppError("No Video ID Provided", StatusCodes.BAD_REQUEST);

    const streamUrl = await InnertubeService.getStreamingLink(videoId);
    if (!streamUrl)
        throw new AppError("No Streams Available", StatusCodes.NOT_FOUND);

    res.status(StatusCodes.OK).json(successResponse(streamUrl));
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getSearchSuggestions = async function (req, res) {
    const query = req.query?.q;
    if (!query) throw new AppError("Missing Query", StatusCodes.BAD_REQUEST);

    const suggestions = await InnertubeService.getSearchSuggestions(query);

    res.status(StatusCodes.OK).json(successResponse(suggestions));
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getMusics = async function (req, res) {
    const query = req.query.q;
    if (!query) throw new AppError("Missing Query", StatusCodes.BAD_REQUEST);

    const videos = await InnertubeService.getMusics(query);

    res.status(StatusCodes.OK).json(successResponse(videos));
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getPlaylists = async function (req, res) {
    const query = req.query.q;
    if (!query) throw new AppError("Missing Query", StatusCodes.BAD_REQUEST);

    const videos = await InnertubeService.getPlaylists(query);

    res.status(StatusCodes.OK).json(successResponse(videos));
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getNextMusic = async function (req, res) {
    const cuurentSongId = req.params?.currentSongId;
    if (!cuurentSongId)
        throw new AppError(
            "No Current Song ID Provided",
            StatusCodes.BAD_REQUEST
        );

    const videos = await InnertubeService.getRelatedMusics(cuurentSongId);

    res.status(StatusCodes.OK).json(successResponse(videos));
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
exports.getPlaylistInfo = async function (req, res) {
    const playlistId = req.params?.playlistId;
    if (!playlistId)
        throw new AppError("No Playlist ID Provided", StatusCodes.BAD_REQUEST);

    const videos = await InnertubeService.getPlaylistInfo(playlistId);

    res.status(StatusCodes.OK).json(successResponse(videos));
};
