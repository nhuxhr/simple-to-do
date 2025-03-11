import { Exclude, instanceToPlain } from 'class-transformer';
import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';
import { SessionStatusEnum, User } from '@prisma/client';
import { UserEntity } from '@/domain/user/entity/user.entity';

export class SessionEntity {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  expiresAt: Date;

  @IsDate()
  lastSeenAt: Date | null;

  @IsUUID()
  userId: string;

  @IsString()
  @Exclude()
  token: string;

  @IsEnum(SessionStatusEnum)
  status: SessionStatusEnum;

  user?: User;

  constructor(partial: Partial<SessionEntity>) {
    if (partial.user) partial.user = new UserEntity(partial.user);
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
