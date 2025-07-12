const { Innertube, UniversalCache, YTNodes, YT } = require("youtubei.js");

class InnertubeService {
    /** @type {Innertube | undefined} */
    #_innertube = undefined;

    async setupInnertube() {
        this.#_innertube = await Innertube.create({
            cache: new UniversalCache(true),
        });
    }

    /**
     * Returns Array Of String for search suggestions
     * @param {string} query
     */
    async getSearchSuggestions(query) {
        return await this.#_innertube.getSearchSuggestions(query);
    }

    /**
     * Return Streaming Link
     * @param {string} videoId
     */
    async getStreamingLink(videoId) {
        const data = await this.#_innertube.getStreamingData(videoId);
        return data.url;
    }

    /**
     * Return Array Of Videos
     * @param {string} query
     */
    async getMusics(query) {
        const data = await this.#_innertube.music.search(query, {
            type: "song",
        });
        const retVal = [];

        for (const music of data.contents[0].contents) {
            try {
                retVal.push({
                    id: music.id,
                    title: music.title ?? "Unknown",
                    author: music.artists[0].name,
                    duration: music.duration?.seconds || 0,
                    thumbnail: music.thumbnail?.contents[0].url,
                });
            } catch (error) {}
        }

        return retVal;
    }

    /**
     * Return Array Of Playlists
     * @param {string} query
     */
    async getPlaylists(query) {
        const data = await this.#_innertube.music.search(query, {
            type: "playlist",
        });

        const retval = [];

        for (const playlist of data.contents[0].as(YTNodes.MusicShelf)
            .contents) {
            retval.push({
                id: playlist.id,
                name: playlist.title ?? "Unknown",
                thumbnail: playlist.thumbnail?.contents[0].url,
            });
        }

        return retval;
    }

    /**
     * Return Next Music
     * @param {string} musicId
     */
    async getRelatedMusics(musicId) {
        const list = await this.#_innertube.music.getRelated(musicId);

        if (list.is(YTNodes.Message)) {
            throw new Error(list.text);
        }

        const retVal = [];

        for (const music of list.contents[0].as(YTNodes.MusicCarouselShelf)
            .contents) {
            try {
                retVal.push({
                    id: music.id,
                    title: music.title ?? "Unknown",
                    author: music.artists[0].name,
                    duration: music.duration?.seconds || 0,
                    thumbnail: music.thumbnail?.contents[0].url,
                });
            } catch (error) {}
        }
        return retVal;
    }

    /**
     * Return Playlist Details
     * @param {string} playlistId
     */
    async getPlaylistInfo(playlistId) {
        const info = await this.#_innertube.getPlaylist(playlistId);

        const basicInfo = {
            title: info.info.title,
            totalVideos: info.info.total_items,
            thumnail: info.info.thumbnails[0].url,
        };

        const videos = [];

        info.videos.forEach((it) => {
            const video = it.as(YTNodes.PlaylistVideo);
            videos.push({
                id: video.id,
                title: video.title.text ?? "Unknown",
                author: video.author.name,
                duration: video.duration.seconds,
                thumbnail: video.thumbnails[0].url,
            });
        });

        return { ...basicInfo, videos };
    }
}

module.exports = new InnertubeService();
