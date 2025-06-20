import { Repository } from "typeorm";
import { Database } from "~/database";
import { PlaylistEntity, SongEntity } from "~/database/entities";
import { Music } from "~/models";

class LocalPlaylistRepository {
  private readonly _playlistDatabase: Repository<PlaylistEntity>;
  private readonly _songsDatabase: Repository<SongEntity>;

  public constructor() {
    this._playlistDatabase = Database.datasource.getRepository(PlaylistEntity);
    this._songsDatabase = Database.datasource.getRepository(SongEntity);
  }

  public async addMusicToPlaylistAsync(playlistId: number, music: Music) {
    try {
      const playlist = await this.getPlaylistWithIdAsync(playlistId);
      if (!playlist) {
        throw new Error("Playlist Not Found");
      }
      let storedSong = await this._songsDatabase.findOne({ where: { songId: music.videoId } });
      if (!storedSong) {
        storedSong = this._songsDatabase.create({
          title: music.title,
          duration: music.duration,
          songId: music.videoId,
          thumbnail: music.thumbnail,
          uploadedBy: music.author,
        });
      }

      playlist.songs = [...playlist.songs, storedSong];
      await this._playlistDatabase.save(playlist);
    } catch (error) {
      console.log(error);
    }
  }

  public async getAllPlaylistAsync(): Promise<{ id: number; name: string; songCount: number }[]> {
    const list = await this._playlistDatabase
      .createQueryBuilder("pl")
      .select(["pl.id AS id", "pl.name AS name"])
      .leftJoin("pl.songs", "songs")
      .addSelect("COUNT(songs.id)", "songCount")
      .groupBy("pl.id")
      .getRawMany();

    return list;
  }

  public async getPlaylistWithIdAsync(id: number): Promise<PlaylistEntity | null> {
    const playlist = await this._playlistDatabase.findOne({ where: { id }, relations: ["songs"] });
    return playlist;
  }

  public async createNewPaylistAsync(name: string): Promise<void> {
    const playlist = this._playlistDatabase.create({ name });
    await this._playlistDatabase.save(playlist);
  }

  public async deletePlaylistAsync(id: number) {
    await this._playlistDatabase.delete(id);
  }

  public async updatePlaylistTitleAsync(playlistId: number, newTitle: string) {
    await this._playlistDatabase.update(playlistId, { name: newTitle });
  }
}

export default new LocalPlaylistRepository();
