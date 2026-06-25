import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTnldContractReports1722700000000 implements MigrationInterface {
  name = 'CreateTnldContractReports1722700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tnld_contract_reports',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'enterprise_id', type: 'int', isNullable: true },
          { name: 'year', type: 'int' },
          { name: 'period', type: 'varchar', length: '20', default: "'6m'" },
          { name: 'status', type: 'varchar', length: '30', default: "'draft'" },
          { name: 'submitted_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tnld_contract_reports',
      new TableForeignKey({
        columnNames: ['enterprise_id'],
        referencedTableName: 'enterprises',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'tnld_contract_report_overviews',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'report_id', type: 'int', isUnique: true },
          { name: 'total_employees', type: 'int', default: 0 },
          { name: 'female_employees', type: 'int', default: 0 },
          { name: 'payroll', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'total_accidents', type: 'int', default: 0 },
          { name: 'fatal_accidents', type: 'int', default: 0 },
          { name: 'multi_victim_accidents', type: 'int', default: 0 },
          { name: 'total_victims', type: 'int', default: 0 },
          { name: 'female_victims', type: 'int', default: 0 },
          { name: 'dead_victims', type: 'int', default: 0 },
          { name: 'severe_victims', type: 'int', default: 0 },
          { name: 'unmanaged_victims', type: 'int', default: 0 },
          { name: 'unmanaged_female_victims', type: 'int', default: 0 },
          { name: 'unmanaged_dead_victims', type: 'int', default: 0 },
          { name: 'unmanaged_severe_victims', type: 'int', default: 0 },
          { name: 'medical_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'treatment_salary_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'compensation_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'workdays_lost', type: 'int', default: 0 },
          { name: 'asset_damage', type: 'numeric', precision: 18, scale: 2, default: '0' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tnld_contract_report_overviews',
      new TableForeignKey({
        columnNames: ['report_id'],
        referencedTableName: 'tnld_contract_reports',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'tnld_contract_report_accident_details',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'report_id', type: 'int' },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'cause', type: 'varchar', length: '500', isNullable: true },
          { name: 'injury_factor', type: 'varchar', length: '500', isNullable: true },
          { name: 'occupation', type: 'varchar', length: '500', isNullable: true },
          { name: 'total_accidents', type: 'int', default: 0 },
          { name: 'fatal_accidents', type: 'int', default: 0 },
          { name: 'multi_victim_accidents', type: 'int', default: 0 },
          { name: 'total_victims', type: 'int', default: 0 },
          { name: 'female_victims', type: 'int', default: 0 },
          { name: 'dead_victims', type: 'int', default: 0 },
          { name: 'severe_victims', type: 'int', default: 0 },
          { name: 'unmanaged_victims', type: 'int', default: 0 },
          { name: 'unmanaged_female_victims', type: 'int', default: 0 },
          { name: 'unmanaged_dead_victims', type: 'int', default: 0 },
          { name: 'unmanaged_severe_victims', type: 'int', default: 0 },
          { name: 'medical_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'treatment_salary_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'compensation_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'workdays_lost', type: 'int', default: 0 },
          { name: 'asset_damage', type: 'numeric', precision: 18, scale: 2, default: '0' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tnld_contract_report_accident_details',
      new TableForeignKey({
        columnNames: ['report_id'],
        referencedTableName: 'tnld_contract_reports',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'tnld_contract_report_subsidies',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'report_id', type: 'int', isUnique: true },
          { name: 'total_accidents', type: 'int', default: 0 },
          { name: 'fatal_accidents', type: 'int', default: 0 },
          { name: 'multi_victim_accidents', type: 'int', default: 0 },
          { name: 'total_victims', type: 'int', default: 0 },
          { name: 'female_victims', type: 'int', default: 0 },
          { name: 'dead_victims', type: 'int', default: 0 },
          { name: 'severe_victims', type: 'int', default: 0 },
          { name: 'unmanaged_victims', type: 'int', default: 0 },
          { name: 'unmanaged_female_victims', type: 'int', default: 0 },
          { name: 'unmanaged_dead_victims', type: 'int', default: 0 },
          { name: 'unmanaged_severe_victims', type: 'int', default: 0 },
          { name: 'medical_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'treatment_salary_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'compensation_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'total_cost', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'workdays_lost', type: 'int', default: 0 },
          { name: 'asset_damage', type: 'numeric', precision: 18, scale: 2, default: '0' },
          { name: 'note', type: 'varchar', length: '500', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tnld_contract_report_subsidies',
      new TableForeignKey({
        columnNames: ['report_id'],
        referencedTableName: 'tnld_contract_reports',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'tnld_contract_report_attachments',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'report_id', type: 'int' },
          { name: 'file_name', type: 'varchar', length: '255' },
          { name: 'file_url', type: 'varchar', length: '500', isNullable: true },
          { name: 'mime_type', type: 'varchar', length: '100', default: "'application/pdf'" },
          { name: 'file_size', type: 'int', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tnld_contract_report_attachments',
      new TableForeignKey({
        columnNames: ['report_id'],
        referencedTableName: 'tnld_contract_reports',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tnld_contract_report_attachments');
    await queryRunner.dropTable('tnld_contract_report_subsidies');
    await queryRunner.dropTable('tnld_contract_report_accident_details');
    await queryRunner.dropTable('tnld_contract_report_overviews');
    await queryRunner.dropTable('tnld_contract_reports');
  }
}
