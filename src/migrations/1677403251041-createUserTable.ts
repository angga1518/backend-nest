import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserTable1677403251041 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        "created" TIMESTAMP NOT NULL,
        "create_by" varchar(255) NOT NULL,
        "last_updated" TIMESTAMP NOT NULL,
        "last_update_by" varchar(255) NOT NULL,
        "email" varchar(255) UNIQUE NOT NULL,
        "name" varchar(255) NOT NULL,
        "phone_number" varchar(20),
        "password" varchar(255) NOT NULL,
        "image_url" text
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
