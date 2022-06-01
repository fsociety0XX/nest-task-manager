import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../tasks-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly TaskStatusTypes = [
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.checkStatus(value))
      throw new BadRequestException('Invalid status provided');
    return value;
  }

  private checkStatus(status: any): boolean {
    const index = this.TaskStatusTypes.indexOf(status);
    return index !== -1;
  }
}
