import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { seconds, Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@/common/guards/auth.guard';
import { SignUpDto } from '@/domain/user/dto/sign-up.dto';
import { SignInDto } from '@/domain/user/dto/sign-in.dto';
import { ResetPasswordDto } from '@/domain/user/dto/reset-password.dto';
import { UserEntity } from '@/domain/user/entity/user.entity';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Throttle({
    default: {
      ttl: seconds(5),
      limit: 1,
    },
  })
  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiCreatedResponse({ description: 'User successfully signed up' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() dto: SignUpDto) {
    return this.svc.signUp(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiOkResponse({ description: 'User successfully signed in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: SignInDto })
  async signIn(@Body() dto: SignInDto) {
    return this.svc.signIn(dto);
  }

  @Delete('logout')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Log out the current user' })
  @ApiSecurity('jwt')
  @ApiOkResponse({ description: 'User successfully logged out' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Req() req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.svc.logout(req.user!, token!);
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user information' })
  @ApiSecurity('jwt')
  @ApiOkResponse({ description: 'Current user information' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  whoAmI(@Req() req: Request) {
    return new UserEntity(req.user!);
  }

  @Patch('password')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change the current user password' })
  @ApiSecurity('jwt')
  @ApiOkResponse({ description: 'Password successfully changed' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: ResetPasswordDto })
  async changePassword(@Req() req: Request, @Body() dto: ResetPasswordDto) {
    return this.svc.changePassword(req.user!, dto);
  }
}
