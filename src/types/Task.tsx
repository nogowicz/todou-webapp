import {
  BsArrowDownRightCircle,
  BsArrowUpRightCircle,
  BsFire,
} from 'react-icons/bs';
import { ISubtask } from './Subtask';
import { SiFireship } from 'react-icons/si';

export enum TaskImportance {
  Important = 'Important',
  NotImportant = 'Not important',
}

export interface ITaskImportance {
  id: TaskImportance;
  name: TaskImportance;
  icon: JSX.Element;
  translationKey: string;
}

export const TaskImportanceObject: ITaskImportance[] = [
  {
    id: TaskImportance.NotImportant,
    name: TaskImportance.NotImportant,
    icon: <BsArrowDownRightCircle />,
    translationKey: 'not-important',
  },
  {
    id: TaskImportance.Important,
    name: TaskImportance.Important,
    icon: <BsArrowUpRightCircle />,
    translationKey: 'important',
  },
];

export enum TaskUrgency {
  Urgent = 'Urgent',
  NotUrgent = 'Not urgent',
}

export interface ITaskUrgency {
  id: TaskUrgency;
  name: TaskUrgency;
  icon: JSX.Element;
  translationKey: string;
}

export const TaskUrgencyObject = [
  {
    id: TaskUrgency.NotUrgent,
    name: TaskUrgency.NotUrgent,
    icon: <BsFire />,
    translationKey: 'not-urgent',
  },
  {
    id: TaskUrgency.Urgent,
    name: TaskUrgency.Urgent,
    icon: <SiFireship />,
    translationKey: 'urgent',
  },
];

export interface ITask {
  taskId: number;
  title: string;
  listId: number;
  isCompleted: boolean;
  deadline: Date | null;
  importance: TaskImportance;
  urgency: TaskUrgency;
  note: string | null;
  addedBy: number;
  assignedTo: number;
  createdAt: Date;
  notificationTime: Date | null;
  subtask: ISubtask[];
}
