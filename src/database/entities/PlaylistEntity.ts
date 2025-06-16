import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
} from "typeorm/browser";
import SongEntity from "./SongEntity";

@Entity("playlist")
export default class PlaylistEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @OneToMany(() => SongEntity, (song) => song.playlist, { cascade: true })
  public songs!: SongEntity[];

  @CreateDateColumn()
  public createdAt!: Date;
}
