import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { UserEntity } from '@/domain/user/entity/user.entity';
import {
  GetTasksQueryDto,
  TaskFilter,
} from '@/domain/task/dto/get-tasks-query.dto';
import { TaskEntity } from '@/domain/task/entity/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask({ id: userId }: UserEntity, title: string) {
    return new TaskEntity(
      await this.prisma.task.create({
        data: {
          title,
          userId,
        },
      }),
    );
  }

  async getTasks(
    { id: userId }: UserEntity,
    { filter, page = 1, limit = 10 }: GetTasksQueryDto,
  ) {
    if (page < 1) throw new BadRequestException('Page must greater than 0');
    if (limit < 1) throw new BadRequestException('Limit must greater than 0');
    if (limit > 100) throw new BadRequestException('Limit must less than 100');

    let count = 0;
    let items: Task[] = [];

    if (filter === TaskFilter.UNCOMPLETED) {
      const where = Prisma.validator<Prisma.TaskWhereInput>()({
        userId,
        completed: false,
      });

      count = await this.prisma.task.count({ where });
      items = await this.prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } else if (filter === TaskFilter.COMPLETED) {
      const where = Prisma.validator<Prisma.TaskWhereInput>()({
        userId,
        completed: true,
      });

      count = await this.prisma.task.count({ where });
      items = await this.prisma.task.findMany({
        where,
        orderBy: { completedAt: 'asc' },
      });
    } else {
      // filter === 'all'
      const where = Prisma.validator<Prisma.TaskWhereInput>()({
        userId,
      });

      count = await this.prisma.task.count({ where });
      const uncompleted = await this.prisma.task.findMany({
        where: { userId, completed: false },
        orderBy: { createdAt: 'desc' },
      });
      const completed = await this.prisma.task.findMany({
        where: { userId, completed: true },
        orderBy: { completedAt: 'desc' },
      });

      items = [...uncompleted, ...completed]; // Uncompleted tasks first, then completed
    }

    return {
      items: items.map((item) => new TaskEntity(item)),
      pagination: {
        page,
        pages: Math.ceil(count / limit),
        total: count,
        size: items.length,
      },
    };
  }

  async getTaskById({ id: userId }: UserEntity, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return new TaskEntity(task);
  }

  async updateTask(
    { id: userId }: UserEntity,
    taskId: string,
    data: { title?: string; completed?: boolean },
  ) {
    // Verify the task exists and belongs to the user
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Prepare update data
    const updateData: Partial<Task> = {};
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.completed !== undefined) {
      updateData.completed = data.completed;
      updateData.completedAt = data.completed ? new Date() : null;
    }

    return new TaskEntity(
      await this.prisma.task.update({
        where: { id: taskId },
        data: updateData,
      }),
    );
  }

  async deleteTask({ id: userId }: UserEntity, taskId: string) {
    // Verify the task exists and belongs to the user
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return true;
  }
}
