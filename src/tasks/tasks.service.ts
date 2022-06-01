import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { TaskEntity } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTask(filterTaskDto: FilterTaskDTO): Promise<TaskEntity[]> {
    return await this.taskRepository.fetchTasks(filterTaskDto);
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<TaskEntity> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const taskFound = await this.taskRepository.findOne(id);
    if (!taskFound)
      throw new NotFoundException(`Task with ID: ${id} not found`);
    return taskFound;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (!result.affected)
      throw new NotFoundException(`Task with ID: ${id} not found`);
  }

  async updateTask(id: number, taskStatus: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = taskStatus;
    await task.save();

    return task;
  }
}
