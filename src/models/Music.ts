import { Track } from "react-native-track-player";
import { SongEntity } from "~/database/entities";

export default class Music {
  public constructor(
    public readonly videoId: string,
    public readonly title: string,
    public readonly author: string,
    public readonly duration: number,
    public readonly thumbnail: string
  ) {}

  public static convertMusicToRNTPTrack(
    music: Music,
    streamigLink: string
  ): Track & { id: string } {
    return {
      url: streamigLink,
      title: music.title,
      artist: music.author,
      artwork: music.thumbnail,
      duration: music.duration,
      id: music.videoId,
    };
  }

  public static convertFromSongEntity(entitiy: SongEntity): Music {
    return new Music(
      entitiy.songId,
      entitiy.title,
      entitiy.uploadedBy,
      entitiy.duration,
      entitiy.thumbnail
    );
  }
}
