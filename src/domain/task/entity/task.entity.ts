import { instanceToPlain } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { User } from '@prisma/client';
import { UserEntity } from '@/domain/user/entity/user.entity';

export class TaskEntity {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsUUID()
  userId: string;

  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;

  @IsDate()
  @IsOptional()
  completedAt: Date | null;

  user?: User;

  constructor(partial: Partial<TaskEntity>) {
    if (partial.user) partial.user = new UserEntity(partial.user);
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
