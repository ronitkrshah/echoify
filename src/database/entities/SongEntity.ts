import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from "typeorm/browser";
import PlaylistEntity from "./PlaylistEntity";

@Entity("song")
export default class SongEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public title!: string;

  @Column()
  public thumbnail!: string;

  @Column()
  public uploadedBy!: string;

  @Column("int")
  public duration!: number;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.songs)
  public playlist!: PlaylistEntity;
}
