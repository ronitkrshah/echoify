import { Track } from "react-native-track-player";
import { DataSource, Repository } from "typeorm";
import { Database } from "~/database";
import { SongEntity, RecentsEntity } from "~/database/entities";

class RecentsRepository {
  private readonly _db: Repository<RecentsEntity>;
  private _isInitialized = false;
  private readonly PRIMARY_RECENT_ID = 1;

  public constructor() {
    this._db = Database.datasource.getRepository(RecentsEntity);
  }

  private async createRecentsTableIfNotExists() {
    if (this._isInitialized) return;
    const table = await this._db.findOneBy({ id: this.PRIMARY_RECENT_ID });
    if (!table) {
      const recent = this._db.create({ name: "Primary Recents" });
      await this._db.save(recent);
      this._isInitialized = true;
    }
  }

  public async getAllMusicsAsync(): Promise<SongEntity[] | undefined> {
    await this.createRecentsTableIfNotExists();
    const list = await this._db.findOne({
      where: {
        id: this.PRIMARY_RECENT_ID,
      },
      select: {
        songs: true,
      },
      order: {
        songs: {
          createdAt: "DESC",
        },
      },
      relations: ["songs"],
    });

    return list?.songs;
  }

  public async addSongToRecentsAsync(song: Track & { id: string }) {
    await this.createRecentsTableIfNotExists();
    const recents = await this._db.findOne({
      where: {
        id: this.PRIMARY_RECENT_ID,
      },
      relations: ["songs"],
    });
    if (!recents) {
      throw new Error("Failed To Find Primary Recent Table");
    }

    const songFromTrack = new SongEntity();
    songFromTrack.title = song.title ?? "Unknown Song";
    songFromTrack.songId = song.id;
    songFromTrack.duration = song.duration ?? 0;
    songFromTrack.thumbnail = song.artwork!;
    songFromTrack.uploadedBy = song.artist!;

    recents.songs = [...recents.songs, songFromTrack];

    await this._db.save(recents);
  }
}

export default new RecentsRepository();
