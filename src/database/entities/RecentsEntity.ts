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

@Entity("recents")
export default class RecentsEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @OneToMany(() => SongEntity, (song) => song.recent, { cascade: true })
  @JoinColumn()
  public songs!: SongEntity[];

  @CreateDateColumn()
  public createdAt!: Date;
}
