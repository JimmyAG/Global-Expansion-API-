import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScoreCalculationFunction1757027111836
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION IF EXISTS calculate_match_score`);

    await queryRunner.query(`
      CREATE FUNCTION calculate_match_score(
        overlap_count INT,
        vendor_rating DECIMAL(5,2),
        response_sla_hours INT
      )
      RETURNS DECIMAL(5,2)
      DETERMINISTIC
      BEGIN
        DECLARE sla_weight INT;

        IF response_sla_hours <= 24 THEN
          SET sla_weight = 5;
        ELSEIF response_sla_hours <= 72 THEN
          SET sla_weight = 3;
        ELSE
          SET sla_weight = 1;
        END IF;

        RETURN (overlap_count * 2 + vendor_rating + sla_weight);
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS calculate_match_score;
    `);
  }
}
