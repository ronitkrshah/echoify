const { Innertube } = require("../lib");

/**
 * @param {Request} req
 * @param {Response} res
 */
async function getMusicStreamingInfo(req, res) {
    const innertube = Innertube.getInstance();
    try {
        const data = await innertube.getStreamingData(req.params.id, {
            quality: "best",
        });
        return res.status(200).json({ status: true, url: data.url });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
}

module.exports = {
    getMusicStreamingInfo,
};
