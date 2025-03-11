import { Controller, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { TasksService } from './tasks.service';

@ApiTags('Session')
@UseGuards(AuthGuard)
@ApiSecurity('jwt')
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly svc: TasksService) {}
}
