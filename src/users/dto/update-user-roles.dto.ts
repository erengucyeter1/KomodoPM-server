import { IsString, IsArray, IsInt } from 'class-validator';

export class UpdateUserRolesDto {
  @IsString()
  username: string;

  @IsArray()
  @IsInt({ each: true })
  roles: number[];
}