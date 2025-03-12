import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741772612540 implements MigrationInterface {
    name = 'Migrations1741772612540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "uploaded_file" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "driveFileId" character varying NOT NULL, "webViewLink" character varying NOT NULL, "webContentLink" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ad8677945b00e3bc846cdfef9ae" UNIQUE ("driveFileId"), CONSTRAINT "PK_e2aa19a0c9b98da779d8eb571fa" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "uploaded_file"`);
    }

}
