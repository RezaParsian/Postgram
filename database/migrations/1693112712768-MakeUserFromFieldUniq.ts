import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserFromFieldUniq1693112712768 implements MigrationInterface {
    name = 'MakeUserFromFieldUniq1693112712768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_44164c9a4eb050ca5d11f33d2ef" UNIQUE ("from")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_44164c9a4eb050ca5d11f33d2ef"`);
    }

}
