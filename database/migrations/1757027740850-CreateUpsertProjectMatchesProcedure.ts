import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUpsertProjectMatchesProcedure1757027740850
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP PROCEDURE IF EXISTS insert_matches_for_project;
    `);

    await queryRunner.query(`
      CREATE PROCEDURE insert_matches_for_project(IN project_uuid CHAR(36))
      BEGIN
        INSERT INTO matches (id, project_id, vendor_id, score, created_at, updated_at)
        SELECT *
        FROM (
          SELECT
            UUID() AS id,
            p.id AS project_id,
            v.id AS vendor_id,
            calculate_match_score(
              COUNT(*),
              v.rating,
              v.response_sla_hours
            ) AS score,
            NOW() AS created_at,
            NOW() AS updated_at
          FROM projects p
          JOIN vendors v
            ON JSON_CONTAINS(v.countries_supported, JSON_QUOTE(p.country))
          JOIN JSON_TABLE(
            p.services_needed,
            '$[*]' COLUMNS (svc VARCHAR(100) PATH '$.name')
          ) ps ON TRUE
          JOIN JSON_TABLE(
            v.services_offered,
            '$[*]' COLUMNS (svc VARCHAR(100) PATH '$.name')
          ) vs ON TRUE
          WHERE p.id = project_uuid
            AND ps.svc = vs.svc
          GROUP BY p.id, v.id, v.rating, v.response_sla_hours
        ) AS new
        ON DUPLICATE KEY UPDATE
          score = new.score,
          updated_at = new.updated_at;
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP PROCEDURE IF EXISTS insert_matches_for_project;
    `);
  }
}
