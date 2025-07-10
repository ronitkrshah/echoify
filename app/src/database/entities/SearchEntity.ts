import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm/browser";

@Entity("search")
export default class SearchEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public query!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
