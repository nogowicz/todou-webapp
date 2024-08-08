import { IoClose } from 'react-icons/io5';
import { useRef } from 'react';
import styles from '../task-manager.module.scss';
import { ISubtask } from '@/types/Subtask';
import Checkbox from '@/components/checkbox/Checkbox';

interface SubtaskProps {
  index: number;
  subtask: ISubtask;
  updateSubtask: (
    index: number,
    newSubtask: string,
    isCompleted: boolean
  ) => void;
  removeSubtask: (index: number) => void;
  primaryColor: string;
}

const Subtask = ({
  index,
  subtask,
  updateSubtask,
  removeSubtask,
  primaryColor,
}: SubtaskProps) => {
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.overlay__addNewTask__subtasksContainer__subtask}>
      {' '}
      <Checkbox
        isCompleted={subtask.isCompleted}
        onClick={() =>
          updateSubtask(index, subtask.title, !subtask.isCompleted)
        }
        primaryColor={primaryColor}
      />
      <input
        title="subtask"
        placeholder="Enter subtask"
        value={subtask.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateSubtask(index, e.target.value, subtask.isCompleted)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            subtaskInputRef.current?.focus();
          }
        }}
      />
      <IoClose onClick={() => removeSubtask(index)} size={32} />
    </div>
  );
};

export default Subtask;
