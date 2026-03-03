import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init001 implements MigrationInterface {
  name = 'Init1710001234567';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id"      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "balance" NUMERIC(12, 2) NOT NULL DEFAULT 0
      )
    `);

    await queryRunner.query(`
      CREATE TYPE payment_action AS ENUM ('debit', 'credit')
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payment_history" (
        "id"      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL REFERENCES "users"("id"),
        "action"  payment_action NOT NULL,
        "amount"  NUMERIC(12, 2) NOT NULL CHECK ("amount" > 0),
        "ts"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_payment_history_user_id_ts"
        ON "payment_history"("user_id", "ts")
    `);

    await queryRunner.query(`INSERT INTO USERS VALUES ('019cb50e-a01e-7550-a15a-72190520ae0e', 1)`)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_payment_history_user_id_ts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payment_history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_action`);
  }
}
