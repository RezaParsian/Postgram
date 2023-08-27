import { MigrationInterface, QueryRunner } from "typeorm";

export class PostLog1692950522927 implements MigrationInterface {
    name = 'PostLog1692950522927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_logs" ("id" SERIAL NOT NULL, "date" character varying(61) NOT NULL, "description" character varying(2048) NOT NULL, "location" character varying(254) NOT NULL, "time" character varying(5) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "PK_45a723c97053a9fe680798b39f2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "post_logs"`);
    }

}
