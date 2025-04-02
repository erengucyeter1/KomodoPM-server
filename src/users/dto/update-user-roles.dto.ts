import { IsString, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserRolesDto {
  @IsString()
  username: string;

  @IsArray()
  @IsInt({ each: true })
  roles: number[];
}