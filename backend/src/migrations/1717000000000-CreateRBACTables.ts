import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRBACTables1717000000000 implements MigrationInterface {
  name = 'CreateRBACTables1717000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. permissions
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'code', type: 'varchar', length: '50', isUnique: true },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'type', type: 'enum', enum: ['Group', 'Component'] },
          { name: 'parent_id', type: 'int', isNullable: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'permissions',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    );

    // 2. roles
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'code', type: 'varchar', length: '50', isUnique: true },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
      true,
    );

    // 3. role_permissions (junction)
    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'role_id', type: 'int' },
          { name: 'permission_id', type: 'int' },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
      true,
    );

    // FK: role_permissions -> roles
    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    // FK: role_permissions -> permissions
    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    );

    // Unique index on (role_id, permission_id)
    await queryRunner.createIndex(
      'role_permissions',
      new TableIndex({
        name: 'IDX_role_permissions_unique',
        columnNames: ['role_id', 'permission_id'],
        isUnique: true,
      }),
    );

    // 4. titles
    await queryRunner.createTable(
      new Table({
        name: 'titles',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
      true,
    );

    // 5. users (UUID PK)
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'username', type: 'varchar', length: '50', isUnique: true },
          { name: 'password_hash', type: 'varchar', length: '255' },
          { name: 'full_name', type: 'varchar', length: '150' },
          { name: 'email', type: 'varchar', length: '150', isNullable: true, isUnique: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'last_login_at', type: 'timestamptz', isNullable: true },
          { name: 'role_id', type: 'int', isNullable: true },
          { name: 'title_id', type: 'int', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    // FK: users -> roles
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
      }),
    );

    // FK: users -> titles
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['title_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'titles',
        onDelete: 'SET NULL',
      }),
    );

    // Indexes
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_users_is_active', columnNames: ['is_active'] }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_users_role_id', columnNames: ['role_id'] }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'IDX_users_deleted_at', columnNames: ['deleted_at'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permissions');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('titles');
    await queryRunner.dropTable('roles');
    await queryRunner.dropTable('permissions');
  }
}
