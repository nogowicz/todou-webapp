import React, { useEffect, useCallback, cloneElement } from 'react';
import styles from './context-menu.module.scss';

export interface IItems {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
  color?: string;
}

interface IContextMenu {
  items: IItems[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
  position: { x: number; y: number };
}

const ContextMenu = ({
  items,
  visible,
  setVisible,
  position,
}: IContextMenu) => {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (visible) {
        setVisible(false);
      }
    },
    [setVisible, visible]
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick, visible]);

  return visible ? (
    <ul
      className={styles.contextMenu}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      {items.map((item: IItems, index: number) => (
        <li
          key={index}
          className={styles.contextMenuItem}
          onClick={item.onClick}
          style={{ color: item.color }}
        >
          {cloneElement(item.icon, { size: 25 })}
          {item.label}
        </li>
      ))}
    </ul>
  ) : null;
};

export default ContextMenu;
