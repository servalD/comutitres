import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { User } from '../domain/user';
import { GetUsersUseCase } from '../application/use-cases/get-users.use-case';
import { SetUserRoleUseCase } from '../application/use-cases/set-user-role.use-case';
import { SetRolesRequest } from '../application/dto/set-roles.request';
import { toUserResponse, UserResponse } from './user.presenter';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUsers: GetUsersUseCase,
    private readonly setUserRole: SetUserRoleUseCase,
  ) {}

  /** Current authenticated user (any role). */
  @Get('me')
  @ApiOperation({ summary: 'Utilisateur authentifié courant' })
  @ApiOkResponse({ type: UserResponse })
  me(@CurrentUser() user: User): UserResponse {
    return toUserResponse(user);
  }

  /** List all users — admin only. */
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (admin)' })
  @ApiOkResponse({ type: UserResponse, isArray: true })
  async findAll(): Promise<UserResponse[]> {
    const users = await this.getUsers.execute();
    return users.map(toUserResponse);
  }

  /** Change a user's roles — admin only. */
  @Patch(':id/roles')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Modifier les rôles d'un utilisateur (admin)" })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: UserResponse })
  async updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SetRolesRequest,
  ): Promise<UserResponse> {
    const user = await this.setUserRole.execute(id, body.roles);
    return toUserResponse(user);
  }
}
