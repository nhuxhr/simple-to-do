import { Exclude, instanceToPlain } from 'class-transformer';
import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class UserEntity {
  @IsUUID()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
