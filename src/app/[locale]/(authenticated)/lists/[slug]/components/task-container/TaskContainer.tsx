'use client';
import { ESortingType, IList } from '@/types/List';
import { ITask, TaskImportance, TaskUrgency } from '@/types/Task';
import { useListContext } from '@/utils/Providers/ListProvider';
import { notFound } from 'next/navigation';
import React, {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './task-container.module.scss';
import ListItem from '@/components/list-item/ListItem';
import {
  listColorTheme,
  listIconTheme,
} from '@/components/list-item/ListStyles';
import {
  BsCalendar4Week,
  BsClock,
  BsSortAlphaDown,
  BsSortUp,
  BsThreeDots,
} from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import ContextMenu, { IItems } from '@/components/context-menu/ContextMenu';
import { AiOutlineEdit } from 'react-icons/ai';
import {
  MdLabelImportantOutline,
  MdOutlineDeleteForever,
  MdOutlineEmergencyShare,
} from 'react-icons/md';
import { IoMdReorder } from 'react-icons/io';
import { GoPeople } from 'react-icons/go';
import {
  RiDeleteBin6Line,
  RiInboxArchiveLine,
  RiInboxUnarchiveLine,
} from 'react-icons/ri';
import ListDetails from '@/components/list-manager/list-details/ListDetails';
import {
  deleteCompletedTasksInList,
  deleteList,
  updateList,
} from '@/actions/List';
import { useUser } from '@/utils/Providers/UserProvider';

import TasksList from './tasks-list/TasksList';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { updateSortIdInDb } from '@/actions/Task';
import Invitation from '@/components/invitation/Invitation';

interface ITaskContainer {
  slug: string;
}

const ICON_SIZE = 50;

export default function TaskContainer({ slug }: ITaskContainer) {
  const { optimisticLists, handleUpdateList, handleUpdateAllTaskSortIds } =
    useListContext();
  const [contextMenuVisibility, setContextMenuVisibility] = useState(false);
  const [sortingTypeMenuVisibility, setSortingTypeMenuVisibility] =
    useState(false);
  const [listDetailsVisibility, setListDetailsVisibility] = useState(false);
  const [isDndEnabled, setIsDndEnabled] = useState(false);
  const { user } = useUser();
  const iconRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Tasks');
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [inCompleteTasks, setInCompleteTasks] = useState<ITask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);
  const [isInvitationModalVisible, setIsInvitationModalVisible] =
    useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const optimisticListUnArchived = optimisticLists.filter(
    (list: IList) => !list.isArchived
  );

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const x = rect.left - 250;
      const y = rect.top + 40;

      setContextMenuPosition({ x, y });
      setContextMenuVisibility(true);
    }
  }, []);

  const list: IList | undefined = optimisticLists.find(
    (list: IList) => list.listId === +slug
  );

  useEffect(() => {
    if (list) {
      let sortedTasks;
      switch (list.sortingType) {
        case ESortingType.alphabetical:
          sortedTasks = list.task.sort((a, b) =>
            a.title.localeCompare(b.title)
          );
          break;
        case ESortingType.deadline:
          sortedTasks = list.task.sort((a, b) => {
            if (a.deadline === null) return 1;
            if (b.deadline === null) return -1;
            return (
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
          });
          break;
        case ESortingType.creation:
          sortedTasks = list.task.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case ESortingType.importance:
          sortedTasks = list.task.sort((a, b) => {
            if (a.importance === b.importance) return 0;
            return a.importance === TaskImportance.Important ? -1 : 1;
          });
          break;
        case ESortingType.urgency:
          sortedTasks = list.task.sort((a, b) => {
            if (a.urgency === b.urgency) return 0;
            return a.urgency === TaskUrgency.Urgent ? -1 : 1;
          });
          break;
        case ESortingType.own:
        default:
          sortedTasks = list.task.sort((a, b) => a.sortId - b.sortId);
          break;
      }
      setTasks(sortedTasks);
      setInCompleteTasks(sortedTasks.filter((task) => !task.isCompleted));
      setCompletedTasks(sortedTasks.filter((task) => task.isCompleted));
    }
  }, [list]);

  if (!list) {
    return notFound();
  }

  const menuItems: IItems[] = [
    {
      label: t('edit-list'),
      icon: <AiOutlineEdit />,
      onClick: () => setListDetailsVisibility(true),
      isActive: list.listId !== user?.idDefaultList,
    },
    {
      label: t('sort-list'),
      icon: <BsSortUp />,
      onClick: () => setSortingTypeMenuVisibility(true),
      isActive: true,
    },
    {
      label: t('delete-completed-tasks'),
      icon: <MdOutlineDeleteForever />,
      onClick: () => deleteCompletedTasksInList(list.listId),
      isActive: completedTasks.length > 0,
    },
    {
      label: isDndEnabled ? t('disable-order') : t('enable-order'),
      icon: <IoMdReorder />,
      onClick: () => setIsDndEnabled((prev) => !prev),
      isActive: list.sortingType === ESortingType.own,
    },
    {
      label: list.isArchived ? t('unarchive-list') : t('archive-list'),
      icon: list.isArchived ? <RiInboxUnarchiveLine /> : <RiInboxArchiveLine />,
      onClick: list.isArchived
        ? () => {
            const updatedList: IList = {
              ...list,
              isArchived: false,
            };
            handleUpdateList(updatedList);
            updateList(
              list.listId,
              undefined,
              undefined,
              undefined,
              false,
              undefined
            );
          }
        : () => {
            const updatedList: IList = {
              ...list,
              isArchived: true,
            };
            handleUpdateList(updatedList);
            updateList(
              list.listId,
              undefined,
              undefined,
              undefined,
              true,
              undefined
            );
          },
      isActive: list.listId !== user?.idDefaultList,
    },
    {
      label: t('invite-collaborators'),
      icon: <GoPeople />,
      onClick: () => setIsInvitationModalVisible(true),
      isActive: list.listId !== user?.idDefaultList,
    },
    {
      label: t('delete-list'),
      icon: <RiDeleteBin6Line />,
      onClick: () => deleteList(list.listId),
      color: '#D82A38',
      isActive: list.listId !== user?.idDefaultList,
    },
  ];

  const sortingTypeItems: IItems[] = [
    {
      label: t('sort-by-own'),
      icon: <BsSortUp />,
      onClick: async () => {
        handleUpdateList({
          ...list,
          sortingType: ESortingType.own,
        });
        await updateList(
          list.listId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          ESortingType.own
        );
      },
      isActive: true,
    },
    {
      label: t('sort-by-alphabetical'),
      icon: <BsSortAlphaDown />,
      onClick: async () => {
        handleUpdateList({
          ...list,
          sortingType: ESortingType.alphabetical,
        });
        await updateList(
          list.listId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          ESortingType.alphabetical
        );
      },
      isActive: true,
    },
    {
      label: t('sort-by-deadline'),
      icon: <BsCalendar4Week />,
      onClick: async () => {
        handleUpdateList({
          ...list,
          sortingType: ESortingType.deadline,
        });
        await updateList(
          list.listId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          ESortingType.deadline
        );
      },
      isActive: true,
    },
    {
      label: t('sort-by-creation'),
      icon: <BsClock />,
      onClick: async () => {
        handleUpdateList({
          ...list,
          sortingType: ESortingType.creation,
        });
        await updateList(
          list.listId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          ESortingType.creation
        );
      },
      isActive: true,
    },
    {
      label: t('sort-by-importance'),
      icon: <MdLabelImportantOutline />,
      onClick: async () => {
        handleUpdateList({
          ...list,
          sortingType: ESortingType.importance,
        });
        await updateList(
          list.listId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          ESortingType.importance
        );
      },
      isActive: true,
    },
    {
      label: t('sort-by-urgency'),
      icon: <MdOutlineEmergencyShare />,
      onClick: async () => {
        handleUpdateList({
          ...list,
          sortingType: ESortingType.urgency,
        });
        await updateList(
          list.listId,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          ESortingType.urgency
        );
      },
      isActive: true,
    },
  ];

  const getTaskPos = (sortId: number) =>
    tasks.findIndex((task) => task.sortId === sortId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = getTaskPos(Number(active.id));
    const newIndex = getTaskPos(Number(over.id));

    if (oldIndex !== -1 && newIndex !== -1) {
      const updatedTasks = arrayMove(tasks, oldIndex, newIndex);
      console.log(updatedTasks);
      const reindexedTasks = updatedTasks.map((task, index) => ({
        ...task,
        sortId: index + 1,
      }));

      setTasks(reindexedTasks);
      setInCompleteTasks(reindexedTasks.filter((task) => !task.isCompleted));
      setCompletedTasks(reindexedTasks.filter((task) => task.isCompleted));

      handleUpdateAllTaskSortIds(list.listId, reindexedTasks);
      updateSortIdInDb(reindexedTasks);
    }
  };

  return (
    <div className={styles.taskContainer}>
      <div className={styles.taskContainer__left}>
        <div className={styles.taskContainer__left__listsContainer}>
          {optimisticListUnArchived.map((list: IList) => (
            <ListItem list={list} listStyle="list" key={list.listId} />
          ))}
        </div>
      </div>
      <div className={styles.taskContainer__right}>
        <div className={styles.taskContainer__right__upperContainer}>
          <div
            className={styles.taskContainer__right__upperContainer__leftSide}
          >
            {cloneElement(listIconTheme[list.iconId], {
              color: listColorTheme[list.colorVariant],
              size: ICON_SIZE,
            })}
            <h3>{list.listName === 'Tasks' ? t('tasks') : list.listName}</h3>
          </div>
          <div
            className={styles.taskContainer__right__upperContainer__rightSide}
            ref={iconRef}
          >
            <BsThreeDots
              size={ICON_SIZE}
              onClick={(event: any) => handleContextMenu(event)}
            />
          </div>
        </div>
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          autoScroll={false}
          sensors={sensors}
        >
          <div className={styles.taskContainer__right__tasksContainer}>
            <p className={styles.taskContainer__right__tasksContainer__tittle}>
              {t('tasks')} - {inCompleteTasks.length}
            </p>
            <TasksList
              tasks={inCompleteTasks}
              list={list}
              isDndEnabled={isDndEnabled}
            />
          </div>
          {completedTasks.length > 0 && (
            <div className={styles.taskContainer__right__tasksContainer}>
              <p
                className={styles.taskContainer__right__tasksContainer__tittle}
              >
                {t('completed')} - {completedTasks.length}
              </p>
              <TasksList
                tasks={completedTasks}
                list={list}
                isDndEnabled={isDndEnabled}
              />
            </div>
          )}
        </DndContext>
      </div>
      <ContextMenu
        items={menuItems}
        visible={contextMenuVisibility}
        setVisible={setContextMenuVisibility}
        position={contextMenuPosition}
      />

      <ContextMenu
        items={sortingTypeItems}
        visible={sortingTypeMenuVisibility}
        setVisible={setSortingTypeMenuVisibility}
        position={contextMenuPosition}
      />

      <ListDetails
        list={list}
        isVisible={listDetailsVisibility}
        onClose={() => setListDetailsVisibility(false)}
        handleSubmitList={handleUpdateList}
      />
      <Invitation
        isVisible={isInvitationModalVisible}
        setIsVisible={setIsInvitationModalVisible}
        listId={list.listId}
      />
    </div>
  );
}
