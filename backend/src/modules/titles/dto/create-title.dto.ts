import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTitleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
