import { IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'CurrentPass123',
    required: true,
  })
  @IsString()
  old: string;

  @ApiProperty({
    description:
      'New password - must contain at least 8 characters, including uppercase, lowercase, and numbers',
    example: 'NewPass123',
    required: true,
    minimum: 8,
  })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  new: string;
}
