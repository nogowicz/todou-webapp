import { IoClose } from 'react-icons/io5';
import { useRef } from 'react';
import styles from '../task-manager.module.scss';
import { ISubtask } from '@/types/Subtask';

interface SubtaskProps {
  index: number;
  subtask: ISubtask;
  updateSubtask: (index: number, newSubtask: string) => void;
  removeSubtask: (index: number) => void;
}

const Subtask = ({
  index,
  subtask,
  updateSubtask,
  removeSubtask,
}: SubtaskProps) => {
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.overlay__addNewTask__subtasksContainer__subtask}>
      <div
        className={
          styles.overlay__addNewTask__subtasksContainer__subtask__checkbox
        }
      />
      <input
        title="subtask"
        placeholder="Enter subtask"
        value={subtask.title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateSubtask(index, e.target.value)
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
