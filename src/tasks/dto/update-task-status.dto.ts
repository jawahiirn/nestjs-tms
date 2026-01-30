import { TaskStatusEnum } from '../task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;
}
