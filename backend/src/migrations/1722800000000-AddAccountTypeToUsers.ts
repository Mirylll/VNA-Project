import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAccountTypeToUsers1722800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const hasAccountType = table?.findColumnByName('account_type');

    if (!hasAccountType) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'account_type',
          type: 'varchar',
          length: '20',
          default: "'internal'",
        }),
      );
    }

    await queryRunner.query(`
      UPDATE users
      SET account_type = 'enterprise'
      WHERE role_id IN (
        SELECT id FROM roles WHERE code = 'ROLE_ENTERPRISE'
      )
    `);

    await queryRunner.query(`
      UPDATE users
      SET account_type = 'internal'
      WHERE account_type IS NULL OR account_type = ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const hasAccountType = table?.findColumnByName('account_type');

    if (hasAccountType) {
      await queryRunner.dropColumn('users', 'account_type');
    }
  }
}
