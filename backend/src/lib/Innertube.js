const { Innertube: YT, ClientType, UniversalCache } = require("youtubei.js");

class Innertube {
    /** @type {YT | undefined} */
    #_innertube = undefined;

    async setupInnertube() {
        this.#_innertube = await YT.create({
            // client_type: ClientType.ANDROID,
            cache: new UniversalCache(true),
        });
    }

    getInstance() {
        return this.#_innertube;
    }
}

module.exports = new Innertube();
