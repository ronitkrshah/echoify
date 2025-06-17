export default class Music {
  public constructor(
    public readonly videoId: string,
    public readonly title: string,
    public readonly author: string,
    public readonly authorUrl: string,
    public readonly duration: number,
    public readonly thumbnail: string
  ) {}
}
