import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusEnum } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('Task repository');
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }
    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get task for user: ${user.username}, filters: ${JSON.stringify(filterDto)}, error`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatusEnum.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }
}
