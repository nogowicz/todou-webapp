export interface ISubtask {
  subtaskId: number;
  title: string;
  taskId: number;
  isCompleted: boolean;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
