import { Track } from "react-native-track-player";
import { Repository } from "typeorm";
import { Database } from "~/database";
import { SongEntity, RecentsEntity } from "~/database/entities";

class RecentsRepository {
  private readonly _recentsRepo: Repository<RecentsEntity>;
  private readonly _songsRepo: Repository<SongEntity>;
  private _isInitialized = false;
  private readonly PRIMARY_RECENT_ID = 1;

  public constructor() {
    this._recentsRepo = Database.datasource.getRepository(RecentsEntity);
    this._songsRepo = Database.datasource.getRepository(SongEntity);
  }

  private async createRecentsTableIfNotExists() {
    if (this._isInitialized) return;
    const table = await this._recentsRepo.findOneBy({ id: this.PRIMARY_RECENT_ID });
    if (!table) {
      const recent = this._recentsRepo.create({
        id: this.PRIMARY_RECENT_ID,
        name: "Primary Recents",
      });
      await this._recentsRepo.save(recent);
    }
    this._isInitialized = true;
  }

  public async getAllMusicsAsync(): Promise<SongEntity[] | undefined> {
    await this.createRecentsTableIfNotExists();
    const list = await this._recentsRepo.findOne({
      where: { id: this.PRIMARY_RECENT_ID },
      relations: ["songs"],
      order: { songs: { createdAt: "DESC" } },
    });
    return list?.songs;
  }

  public async getLimitedMusicsAsync(offset = 0, limit = 10): Promise<SongEntity[] | undefined> {
    await this.createRecentsTableIfNotExists();
    const list = await this._recentsRepo
      .createQueryBuilder("r")
      .select([
        "songs.createdAt AS createdAt",
        "songs.duration AS duration",
        "songs.id AS id",
        "r.name AS name",
        "r.id AS recentId",
        "songs.songId AS songId",
        "songs.thumbnail AS thumbnail",
        "songs.title AS title",
        "songs.uploadedBy AS uploadedBy",
        "songs.lastPlayed AS lastPlayed",
      ])
      .innerJoin("r.songs", "songs")
      .orderBy("songs.lastPlayed", "DESC")
      .limit(limit)
      .offset(offset)
      .getRawMany();

    return list;
  }

  public async addSongToRecentsAsync(song: Track & { id: string }) {
    await this.createRecentsTableIfNotExists();

    const recents = await this._recentsRepo.findOne({
      where: { id: this.PRIMARY_RECENT_ID },
      relations: ["songs"],
    });

    if (!recents) {
      throw new Error("Failed To Find Primary Recent Table");
    }

    let existingSong = await this._songsRepo.findOneBy({ songId: song.id });

    if (existingSong) {
      existingSong.lastPlayed = new Date();
      await this._songsRepo.save(existingSong);
    } else {
      existingSong = this._songsRepo.create({
        songId: song.id,
        title: song.title ?? "Unknown Song",
        thumbnail: song.artwork ?? "",
        uploadedBy: song.artist ?? "Unknown",
        duration: song.duration ?? 0,
        lastPlayed: new Date(),
      });

      await this._songsRepo.save(existingSong);
    }

    const isAlreadyInRecents =
      (await this._recentsRepo
        .createQueryBuilder("recents")
        .innerJoin("recents.songs", "song", "song.songId = :songId", { songId: song.id })
        .where("recents.id = :recentId", { recentId: this.PRIMARY_RECENT_ID })
        .getCount()) > 0;

    if (!isAlreadyInRecents) {
      recents.songs.push(existingSong);
      await this._recentsRepo.save(recents);
    }
  }
}

export default new RecentsRepository();
