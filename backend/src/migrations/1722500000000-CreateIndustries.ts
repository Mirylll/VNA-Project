import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateIndustries1722500000000 implements MigrationInterface {
  name = 'CreateIndustries1722500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'industries',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'code', type: 'varchar', length: '50', isUnique: true },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'parent_id', type: 'int', isNullable: true },
          { name: 'level', type: 'int', default: 1 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'industries',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'industries',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('industries');
    if (table) {
      const fk = table.foreignKeys.find((fk) => fk.columnNames.indexOf('parent_id') !== -1);
      if (fk) await queryRunner.dropForeignKey('industries', fk);
    }
    await queryRunner.dropTable('industries');
  }
}
