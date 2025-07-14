import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm/browser";
import SongEntity from "./SongEntity";

@Entity("playlist")
export default class PlaylistEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @ManyToMany(() => SongEntity, (song) => song.playlist, { cascade: true })
  @JoinTable()
  public songs!: SongEntity[];

  @CreateDateColumn()
  public createdAt!: Date;
}
