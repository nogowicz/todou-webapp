import { IoCalendarOutline } from 'react-icons/io5';
import { useRef } from 'react';
import CustomSelect from '@/components/custom-select/CustomSelect';
import { IList } from '@/types/List';
import {
  ITaskImportance,
  ITaskUrgency,
  TaskImportanceObject,
  TaskUrgencyObject,
} from '@/types/Task';
import {
  ImportanceOption,
  ImportanceSingleValue,
  ListOption,
  ListSingleValue,
  UrgencyOption,
  UrgencySingleValue,
} from '../helpers';
import styles from '../task-manager.module.scss';

interface TaskDetailsProps {
  t: Function;
  lists: IList[];
  currentList: IList;
  setCurrentList: (list: IList) => void;
  importance: ITaskImportance;
  setImportance: (importance: ITaskImportance) => void;
  urgency: ITaskUrgency;
  setUrgency: (urgency: ITaskUrgency) => void;
  date: Date | null;
  setDate: (date: Date) => void;
}

const TaskDetails = ({
  t,
  lists,
  currentList,
  setCurrentList,
  importance,
  setImportance,
  urgency,
  setUrgency,
  date,
  setDate,
}: TaskDetailsProps) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDatePickerClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  return (
    <div className={styles.overlay__addNewTask__taskDetails}>
      <div className={styles.overlay__addNewTask__taskDetails__option}>
        <p>{t('list')}</p>
        <CustomSelect<IList>
          data={lists}
          SingleValue={ListSingleValue}
          Option={ListOption}
          selectedData={currentList}
          setSelectedData={setCurrentList}
        />
      </div>
      <div className={styles.overlay__addNewTask__taskDetails__option}>
        <p>{t('importance')}</p>
        <CustomSelect<ITaskImportance>
          data={TaskImportanceObject}
          SingleValue={ImportanceSingleValue}
          Option={ImportanceOption}
          selectedData={importance}
          setSelectedData={setImportance}
        />
      </div>
      <div className={styles.overlay__addNewTask__taskDetails__option}>
        <p>{t('urgency')}</p>
        <CustomSelect<ITaskUrgency>
          data={TaskUrgencyObject}
          SingleValue={UrgencySingleValue}
          Option={UrgencyOption}
          selectedData={urgency}
          setSelectedData={setUrgency}
        />
      </div>
      <div className={styles.overlay__addNewTask__taskDetails__option}>
        <p>{t('deadline')}</p>
        <div
          className={
            styles.overlay__addNewTask__taskDetails__option__datePicker
          }
          onClick={handleDatePickerClick}
        >
          <IoCalendarOutline size={32} />
          <input
            placeholder="Pick a date"
            type="date"
            title="deadline"
            ref={dateInputRef}
            value={(date && new Date(date).toISOString().split('T')[0]) || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(new Date(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
