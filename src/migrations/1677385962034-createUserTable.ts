import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1677385962034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
                  "id" SERIAL NOT NULL PRIMARY KEY,
                  "email" character varying NOT NULL,
                  "name" character varying NOT NULL,
                  "password" character varying NOT NULL,
                  CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
              )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
