import { Request } from 'express';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { SessionsService } from './sessions.service';

@ApiTags('Session')
@UseGuards(AuthGuard)
@ApiSecurity('jwt')
@Controller({ path: 'sessions', version: '1' })
export class SessionsController {
  constructor(private readonly svc: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of user sessions' })
  @ApiOkResponse({ description: 'List of user sessions' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  async sessions(
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.svc.sessions(req.user!, token!, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific session' })
  @ApiOkResponse({ description: 'Session details' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'Session ID', example: '12345' })
  async session(@Req() req: Request, @Param('id') id: string) {
    return this.svc.session(req.user!, id);
  }

  @Patch(':id/revoke')
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiOkResponse({ description: 'Session successfully revoked' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'Session ID', example: '12345' })
  async revoke(@Req() req: Request, @Param('id') id: string) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.svc.revoke(req.user!, token!, id);
  }
}
