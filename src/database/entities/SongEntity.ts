import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
} from "typeorm/browser";
import PlaylistEntity from "./PlaylistEntity";
import RecentsEntity from "./RecentsEntity";

@Entity("song")
export default class SongEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public songId!: string;

  @Column()
  public title!: string;

  @Column()
  public thumbnail!: string;

  @Column()
  public uploadedBy!: string;

  @Column("int")
  public duration!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToMany(() => PlaylistEntity, (playlist) => playlist.songs)
  public playlist!: PlaylistEntity;

  @ManyToOne(() => RecentsEntity, (ent) => ent.songs)
  recent!: RecentsEntity;
}
