import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750506359778 implements MigrationInterface {
  name = "InitialMigration1750506359778";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "search" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "query" varchar NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "playlist" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "recents" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" varchar NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "song" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "songId" varchar NOT NULL,
        "title" varchar NOT NULL,
        "thumbnail" varchar NOT NULL,
        "uploadedBy" varchar NOT NULL,
        "duration" integer NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "recentId" integer,
        CONSTRAINT "FK_recent" FOREIGN KEY ("recentId") REFERENCES "recents" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "playlist_songs_song" (
        "playlistId" integer NOT NULL,
        "songId" integer NOT NULL,
        PRIMARY KEY ("playlistId", "songId"),
        FOREIGN KEY ("playlistId") REFERENCES "playlist" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        FOREIGN KEY ("songId") REFERENCES "song" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "playlist_songs_song"`);
    await queryRunner.query(`DROP TABLE "song"`);
    await queryRunner.query(`DROP TABLE "recents"`);
    await queryRunner.query(`DROP TABLE "playlist"`);
    await queryRunner.query(`DROP TABLE "search"`);
  }
}
