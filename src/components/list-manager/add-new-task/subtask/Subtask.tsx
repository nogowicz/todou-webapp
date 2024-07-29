import { IoClose } from 'react-icons/io5';
import { useRef } from 'react';
import styles from '../add-new-task.module.scss';

interface SubtaskProps {
  index: number;
  subtask: string;
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
  console.log(Subtask);
  return (
    <div className={styles.addNewTask__subtasksContainer__subtask}>
      <div
        className={styles.addNewTask__subtasksContainer__subtask__checkbox}
      />
      <input
        title="subtask"
        placeholder="Enter subtask"
        value={subtask}
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
