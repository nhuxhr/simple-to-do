import { Controller, Get } from '@nestjs/common';
import { MainService } from './main.service';
import {
  ApiForbiddenResponse,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Main')
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller({ version: '1' })
export class MainController {
  constructor(private readonly svc: MainService) {}

  @Get('ping')
  @ApiOperation({
    summary: 'Ping the service',
    description:
      'Returns a pong response to indicate the service is up and running.',
  })
  @ApiOkResponse({ description: 'Service is up and running' })
  ping() {
    return this.svc.ping();
  }
}
