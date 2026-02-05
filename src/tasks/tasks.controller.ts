import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return await this.tasksService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.tasksService.deleteTaskById(id);
  }

  @Patch('/status/:id')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return await this.tasksService.updateTaskStatus(id, updateStatusDto);
  }
}
