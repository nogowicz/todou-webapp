import { ISubtask } from './Subtask';

export interface ITask {
  taskId: number;
  title: string;
  listId: number;
  isCompleted: boolean;
  deadline: Date | null;
  importance: string;
  urgency: string;
  note: string | null;
  addedBy: number;
  assignedTo: number;
  createdAt: Date;
  notificationTime: Date | null;
  subtask: ISubtask[];
}
