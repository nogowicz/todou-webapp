'use client';

import React, { useCallback, useRef, useState } from 'react';

import styles from './user-context-menu.module.scss';
import { FaChevronDown } from 'react-icons/fa6';
import Image from 'next/image';

import PlaceholderImg from '../../../../public/profile-picture-placeholder.jpg';
import { IUser } from '@/types/User';
import ContextMenu, { IItems } from '@/components/context-menu/ContextMenu';
import { TbPlaylistAdd, TbUser } from 'react-icons/tb';
import Invitation from '@/components/invitation/Invitation';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface IUserContextMenuProps {
  user: IUser;
}

export default function UserContextMenu({ user }: IUserContextMenuProps) {
  const t = useTranslations('UserContextMenu');
  const router = useRouter();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isInvitationVisible, setIsInvitationVisible] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const onCloseInvitationModal = () => {
    setIsInvitationVisible(false);
  };

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const x = rect.right - 350;
      const y = rect.top + 80;

      setContextMenuPosition({ x, y });
      setIsContextMenuVisible(true);
    }
  }, []);

  const contextMenuItems: IItems[] = [
    {
      label: t('insert-invitation-code'),
      icon: <TbPlaylistAdd />,
      onClick: () => setIsInvitationVisible(true),
      isActive: true,
    },
    {
      label: t('profile'),
      icon: <TbUser />,
      onClick: () => router.push('/profile'),
      isActive: true,
    },
  ];

  return (
    <>
      <div
        className={styles.container}
        onClick={(event: any) => handleContextMenu(event)}
        ref={iconRef}
      >
        <Image
          src={user.photoURL ? user.photoURL : PlaceholderImg}
          alt="User photo"
          width={PlaceholderImg.width}
          height={PlaceholderImg.height}
        />
        <p>{user.firstName}</p>
        <FaChevronDown size={24} />
      </div>
      <ContextMenu
        items={contextMenuItems}
        visible={isContextMenuVisible}
        setVisible={setIsContextMenuVisible}
        position={contextMenuPosition}
      />
      <Invitation
        isVisible={isInvitationVisible}
        onCloseInvitationModal={onCloseInvitationModal}
        isInsertInvitation={true}
      />
    </>
  );
}
