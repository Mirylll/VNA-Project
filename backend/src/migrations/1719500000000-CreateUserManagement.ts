import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateUserManagement1719500000000 implements MigrationInterface {
  name = 'CreateUserManagement1719500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. provinces
    await queryRunner.createTable(
      new Table({
        name: 'provinces',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'name', type: 'varchar', length: '100' },
        ],
      }),
      true,
    );

    // 2. districts
    await queryRunner.createTable(
      new Table({
        name: 'districts',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'province_id', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'districts',
      new TableForeignKey({
        columnNames: ['province_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'provinces',
        onDelete: 'CASCADE',
      }),
    );

    // 3. user_avatars
    await queryRunner.createTable(
      new Table({
        name: 'user_avatars',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'user_id', type: 'uuid', isUnique: true },
          { name: 'file_name', type: 'varchar', length: '255' },
          { name: 'file_path', type: 'varchar', length: '500' },
          { name: 'file_size', type: 'int', isNullable: true },
          { name: 'mime_type', type: 'varchar', length: '50', isNullable: true },
          { name: 'uploaded_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_avatars',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // 4. ALTER users — add columns (IF NOT EXISTS for idempotency)
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth date NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS gender varchar(10) DEFAULT 'Nam' NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url varchar(500) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS address varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS province_id int NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS district_id int NULL`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_id int NULL`);

    // 5. DROP last_login_at (IF EXISTS for idempotency)
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS last_login_at`);

    // 6. FKs on users
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['province_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'provinces',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['district_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'districts',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['avatar_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user_avatars',
        onDelete: 'SET NULL',
      }),
    );

    // 7. Indexes
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_users_province_id', columnNames: ['province_id'] }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_users_district_id', columnNames: ['district_id'] }),
    );
    await queryRunner.createIndex(
      'districts',
      new TableIndex({ name: 'IDX_districts_province_id', columnNames: ['province_id'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse ALTER
    await queryRunner.query(`ALTER TABLE users DROP COLUMN date_of_birth`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN gender`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN avatar_url`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN address`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN province_id`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN district_id`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN avatar_id`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN last_login_at timestamptz NULL`);

    await queryRunner.dropTable('user_avatars');
    await queryRunner.dropTable('districts');
    await queryRunner.dropTable('provinces');
  }
}
