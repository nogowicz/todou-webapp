import React, { ReactNode, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

import styles from './modal.module.scss';

interface IModal {
  title: string;
  onClose: () => void;
  isVisible: boolean;
  children: ReactNode;
}

export default function Modal({ title, onClose, isVisible, children }: IModal) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.overlay__content} ref={modalRef}>
        <div className={styles.overlay__content__upperContainer}>
          <div
            className={styles.overlay__content__upperContainer__placeholder}
          />
          <p>{title}</p>
          <IoClose onClick={onClose} size={32} />
        </div>
        {children}
      </div>
    </div>
  );
}
