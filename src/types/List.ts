import { ITask } from './Task';

export interface IList {
  listId: number;
  listName: string;
  canBeDeleted: boolean;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isArchived: boolean;
  colorVariant: number;
  iconId: number;
  task: ITask[];
}
