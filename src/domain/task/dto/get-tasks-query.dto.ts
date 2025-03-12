import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskFilter {
  ALL = 'all',
  COMPLETED = 'completed',
  UNCOMPLETED = 'uncompleted',
}

export class GetTasksQueryDto {
  @ApiProperty({
    enum: TaskFilter,
    description: 'Filter tasks by their completion status',
    example: TaskFilter.ALL,
    required: false,
    default: TaskFilter.ALL,
  })
  @IsOptional()
  @IsEnum(TaskFilter)
  filter?: TaskFilter = TaskFilter.ALL;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}
