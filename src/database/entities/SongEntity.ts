import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, ManyToMany } from "typeorm/browser";
import PlaylistEntity from "./PlaylistEntity";

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

  @ManyToMany(() => PlaylistEntity, (playlist) => playlist.songs)
  public playlist!: PlaylistEntity;
}
