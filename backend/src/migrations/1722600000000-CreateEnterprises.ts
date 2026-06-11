import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEnterprises1722600000000 implements MigrationInterface {
  name = 'CreateEnterprises1722600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'enterprises',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'tax_code', type: 'varchar', length: '50', isNullable: true },
          { name: 'enterprise_type_id', type: 'int', isNullable: true },
          { name: 'industry_id', type: 'int', isNullable: true },
          { name: 'license_date', type: 'date', isNullable: true },
          { name: 'province_id', type: 'int', isNullable: true },
          { name: 'ward_id', type: 'int', isNullable: true },
          { name: 'address', type: 'varchar', length: '500', isNullable: true },
          { name: 'foreign_name', type: 'varchar', length: '255', isNullable: true },
          { name: 'email', type: 'varchar', length: '200', isNullable: true },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'operation_province_id', type: 'int', isNullable: true },
          { name: 'operation_ward_id', type: 'int', isNullable: true },
          { name: 'operation_address', type: 'varchar', length: '500', isNullable: true },
          { name: 'leader_name', type: 'varchar', length: '100', isNullable: true },
          { name: 'leader_phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'username', type: 'varchar', length: '50', isNullable: true, isUnique: true },
          { name: 'password', type: 'varchar', length: '255', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('enterprises');
  }
}
