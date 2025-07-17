const { Innertube, YTNodes, ClientType } = require("youtubei.js");

class InnertubeService {
    /** @type {Innertube | undefined} */
    #_innertube = undefined;

    async setupInnertube() {
        this.#_innertube = await Innertube.create({
            enable_session_cache: false,
            client_type: ClientType.MUSIC,
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

        /** @type { YTNodes.MusicShelf | undefined} */
        let musicShelf;

        for (const item of data.contents) {
            if (item.type === YTNodes.MusicShelf.name) {
                musicShelf = item;
                break;
            }
        }

        if (!musicShelf) throw new Error("MusicShelf Isn't Available");

        const retVal = [];

        for (const music of musicShelf.contents) {
            try {
                retVal.push({
                    id: music.id,
                    title: music.title ?? "Unknown",
                    author:
                        music.artists?.map((it) => it.name).join(", ") ??
                        "Unknown Artist",
                    duration: music.duration?.seconds || 0,
                    thumbnail: music.thumbnail?.contents[0].url,
                });
            } catch (error) {}
        }

        return retVal;
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
                    author:
                        music.artists?.map((it) => it.name).join(", ") ??
                        "Unknown Artist",
                    duration: music.duration?.seconds || 0,
                    thumbnail: music.thumbnail?.contents[0].url,
                });
            } catch (error) {}
        }

        /** Returning a random music */
        const random = Math.floor(Math.random() * retVal.length);

        return [retVal[random]];
    }

    /**
     * Return Lyrics
     * @param {string} musicId
     */
    async getMusicLyrics(musicId) {
        const list = await this.#_innertube.music.getLyrics(musicId);
        return list?.description?.text;
    }

    /**
     * Return Array Of Playlists
     * @param {string} query
     */
    async getPlaylists(query) {
        const data = await this.#_innertube.music.search(query, {
            type: "playlist",
        });

        /** @type { YTNodes.MusicShelf | undefined} */
        let musicShelf;

        for (const item of data.contents) {
            if (item.type === YTNodes.MusicShelf.name) {
                musicShelf = item;
                break;
            }
        }

        if (!musicShelf) throw new Error("MusicShelf Isn't Available");

        const retval = [];

        for (const playlist of musicShelf.contents) {
            retval.push({
                id: playlist.id,
                name: playlist.title ?? "Unknown",
                thumbnail: playlist.thumbnail?.contents[0].url,
            });
        }

        return retval;
    }

    /**
     * Return Playlist Details
     * @param {string} playlistId
     */
    async getPlaylistInfo(playlistId) {
        const info = await this.#_innertube.music.getPlaylist(playlistId);
        // return info;
        const basicInfo = {
            title: info.header.title.text,
            thumnail: info.background?.contents?.[0].url,
        };

        const videos = [];

        for (const video of info.contents) {
            if (!video?.id) continue;
            videos.push({
                id: video.id,
                title: video.title ?? "Unknown",
                author: video.authors?.map((it) => it.name).join(", "),
                duration: video?.duration?.seconds,
                thumbnail: video.thumbnail?.contents?.[0].url || "",
            });
        }

        return { ...basicInfo, totalVideos: videos.length, videos };
    }
}

module.exports = new InnertubeService();
