import { DataSource } from "typeorm/browser";
import { PlaylistEntity, SearchEntity, SongEntity } from "./entities";

class Database {
  private _dataSource!: DataSource;

  get datasource() {
    return this._dataSource;
  }

  public constructor() {
    this._dataSource = new DataSource({
      database: "echoify",
      driver: require("expo-sqlite"),
      entities: [SearchEntity, SongEntity, PlaylistEntity],
      synchronize: true,
      type: "expo",
    });
  }

  public async initializeDatabaseConnection() {
    if (!this._dataSource.isInitialized) {
      this._dataSource = await this._dataSource.initialize();
    }
  }
}

export default new Database();
