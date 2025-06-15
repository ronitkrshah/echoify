import { TSearchVideoResult } from "./types/TSearchResponse";

export default class PipedApi {
  private static _url: string | undefined = undefined;

  public static setPipedApiUrl(url: string) {
    this._url = url;
  }

  public static async searchVideoAsync(query: string): Promise<TSearchVideoResult[]> {
    console.log(this._url);

    const queryParam = new URLSearchParams();
    queryParam.append("q", query);
    queryParam.append("filter", "all");

    const response = await fetch(`${this._url}/search?${queryParam.toString()}`);

    return (await response.json()).items;
  }
}
