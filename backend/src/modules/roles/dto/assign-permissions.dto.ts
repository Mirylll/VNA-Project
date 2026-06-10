import { ArrayNotEmpty, IsArray } from 'class-validator';

export class AssignPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  permissionIds: string[];
}
