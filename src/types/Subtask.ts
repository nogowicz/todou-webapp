export interface ISubtask {
  subtaskId: number;
  title: string;
  taskId: number;
  isCompleted: boolean;
  addedBy: number;
  createdAt: Date;
  updatedAt: Date;
}
