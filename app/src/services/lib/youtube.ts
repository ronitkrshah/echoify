// === START ===  Making Youtube.js work
import "event-target-polyfill";
import "web-streams-polyfill";
import "text-encoding-polyfill";
import "react-native-url-polyfill/auto";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import { MMKV } from "react-native-mmkv";
// @ts-expect-error to avoid typings' fuss
global.mmkvStorage = MMKV as any;

// See https://github.com/nodejs/node/issues/40678#issuecomment-1126944677
class CustomEvent extends Event {
  #detail;

  constructor(type: string, options?: CustomEventInit<any[]>) {
    super(type, options);
    this.#detail = options?.detail ?? null;
  }

  get detail() {
    return this.#detail;
  }
}

global.CustomEvent = CustomEvent as any;

// === END === Making Youtube.js work

import Innertube, { UniversalCache } from "youtubei.js";

let innertube: Innertube | undefined;

export async function getInnertube() {
  if (innertube) return innertube;
  innertube = await Innertube.create({
    cache: new UniversalCache(false),
    generate_session_locally: true,
  });

  return innertube;
}
