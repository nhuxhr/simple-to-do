import { Request } from 'express';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Query,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '@/domain/task/dto/create-task.dto';
import { GetTasksQueryDto } from '@/domain/task/dto/get-tasks-query.dto';
import { UpdateTaskDto } from '@/domain/task/dto/update-task.dto';

@ApiTags('Task')
@UseGuards(AuthGuard)
@ApiSecurity('jwt')
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiOkResponse({ description: 'Task successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: CreateTaskDto })
  async createTask(@Req() req: Request, @Body() dto: CreateTaskDto) {
    return this.svc.createTask(req.user!, dto.title);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch tasks' })
  @ApiOkResponse({ description: 'List of tasks' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'filter', required: false, example: 'all' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  async getTasks(@Req() req: Request, @Query() query: GetTasksQueryDto) {
    return this.svc.getTasks(req.user!, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiOkResponse({ description: 'Task details' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'Task ID', example: '12345' })
  async getTaskById(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.svc.getTaskById(req.user!, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiOkResponse({ description: 'Task successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'Task ID', example: '12345' })
  @ApiBody({ type: UpdateTaskDto })
  async updateTask(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.svc.updateTask(req.user!, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiOkResponse({ description: 'Task successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'Task ID', example: '12345' })
  async deleteTask(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.svc.deleteTask(req.user!, id);
  }
}
