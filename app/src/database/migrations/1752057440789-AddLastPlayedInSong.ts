import { MigrationInterface, QueryRunner, TableColumn, TableUnique } from "typeorm";

export class AddLastPlayedInSong1752057440789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "song",
      new TableColumn({
        name: "lastPlayed",
        type: "datetime",
        isNullable: true,
      })
    );

    await queryRunner.createUniqueConstraint(
      "song",
      new TableUnique({
        name: "UQ_song_songId",
        columnNames: ["songId"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint("song", "UQ_song_songId");
    await queryRunner.dropColumn("song", "lastPlayed");
  }
}
