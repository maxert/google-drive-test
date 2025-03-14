import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741948754892 implements MigrationInterface {
    name = 'Migrations1741948754892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."files_status_enum" AS ENUM('pending', 'uploading', 'done', 'error')`);
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "originalUrl" text NOT NULL, "driveLink" text, "status" "public"."files_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b41957c528388b6215d72c5830" ON "files" ("originalUrl") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b41957c528388b6215d72c5830"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TYPE "public"."files_status_enum"`);
    }

}
