import { ApiProperty } from '@nestjs/swagger';
import { User } from '../domain/user';
import { Role } from '../../../shared/enums/role.enum';

export class UserResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'franceconnect' })
  provider: string;

  @ApiProperty({ type: String, nullable: true, example: 'user@example.com' })
  email: string | null;

  @ApiProperty({ type: String, nullable: true })
  walletAddress: string | null;

  @ApiProperty({ type: String, nullable: true })
  displayName: string | null;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  @ApiProperty({ format: 'date-time' })
  createdAt: string;
}

/**
 * Maps a domain {@link User} to the public API shape. Deliberately omits the
 * raw provider subject from list responses kept minimal for the demo.
 */
export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  provider: user.provider,
  email: user.email,
  walletAddress: user.walletAddress,
  displayName: user.displayName,
  roles: user.roles,
  createdAt: user.createdAt.toISOString(),
});
