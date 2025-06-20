import { Repository } from "typeorm";
import { Database } from "~/database";
import { PlaylistEntity } from "~/database/entities";

class LocalPlaylistRepository {
  private readonly _db: Repository<PlaylistEntity>;

  public constructor() {
    this._db = Database.datasource.getRepository(PlaylistEntity);
  }

  public async getAllPlaylistAsync(): Promise<{ id: number; name: string; songCount: number }[]> {
    const list = await this._db
      .createQueryBuilder("pl")
      .select(["pl.id AS id", "pl.name AS name"])
      .leftJoin("pl.songs", "songs")
      .addSelect("COUNT(songs.id)", "songCount")
      .groupBy("pl.id")
      .getRawMany();

    return list;
  }

  public async getPlaylistWithIdAsync(id: number): Promise<PlaylistEntity | null> {
    const playlist = await this._db.findOne({ where: { id }, relations: ["songs"] });
    return playlist;
  }

  public async createNewPaylistAsync(name: string): Promise<void> {
    const playlist = this._db.create({ name });
    await this._db.save(playlist);
  }

  public async deletePlaylistAsync(id: number) {
    await this._db.delete(id);
  }

  public async updatePlaylistTitleAsync(playlistId: number, newTitle: string) {
    await this._db.update(playlistId, { name: newTitle });
  }
}

export default new LocalPlaylistRepository();
