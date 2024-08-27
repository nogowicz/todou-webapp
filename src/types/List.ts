import { ITask } from './Task';

export enum ESortingType {
  own = 'own',
  alphabetical = 'alphabetical',
  deadline = 'deadline',
  creation = 'creation',
  importance = 'importance',
  urgency = 'urgency',
}

export interface IList {
  listId: number;
  listName: string;
  canBeDeleted: boolean;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isShared: boolean;
  isArchived: boolean;
  colorVariant: number;
  iconId: number;
  task: ITask[];
  sortingType: ESortingType;
}
