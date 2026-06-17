import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { Role } from '../../../../shared/enums/role.enum';

export class SetRolesRequest {
  @ApiProperty({ enum: Role, isArray: true, example: [Role.USER, Role.ADMIN] })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
