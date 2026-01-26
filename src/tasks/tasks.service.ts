import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateStatusDto } from './dto/update-stastus.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto) {
    const { search, status } = filterDto;
    let tasks = this.tasks;
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }
    return tasks;
  }

  getTaskById(id: string): Task | null {
    const task = this.tasks.find((t) => t.id === id);
    return task ? task : null;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      return true;
    }
    return false;
  }

  updateTaskStatus(id: string, updateStatusDto: UpdateStatusDto): Task | null {
    const { status } = updateStatusDto;
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      return task;
    }
    return null;
  }
}
