import { DataSource } from "typeorm/browser";
import { PlaylistEntity, RecentsEntity, SearchEntity, SongEntity } from "./entities";
import { InitialMigration1750506359778 } from "./migrations/1750506359778-InitialMigration";
import { AddLastPlayedInSong1752057440789 } from "./migrations/1752057440789-AddLastPlayedInSong";

class Database {
  private _dataSource!: DataSource;

  get datasource() {
    return this._dataSource;
  }

  public constructor() {
    this._dataSource = new DataSource({
      database: "echoify.sqlite",
      driver: require("expo-sqlite"),
      entities: [SearchEntity, SongEntity, PlaylistEntity, RecentsEntity],
      synchronize: __DEV__,
      migrations: [InitialMigration1750506359778, AddLastPlayedInSong1752057440789],
      migrationsRun: true,
      type: "expo",
    });
  }

  public async runMigrationsAsync() {
    await this.datasource.runMigrations();
    await this.datasource.synchronize();
  }

  public async initializeDatabaseConnection() {
    if (!this._dataSource.isInitialized) {
      this._dataSource = await this._dataSource.initialize();
    }
  }
}

export default new Database();
