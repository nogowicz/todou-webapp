import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import styles from './invitation.module.scss';
import { IoClose } from 'react-icons/io5';
import { useTranslations } from 'next-intl';
import { createInvitation } from '@/actions/Invitation';
import { IInvitation } from '@/types/Invitation';
import Loader from '../loader/Loader';
import CustomButton from '../custom-button/CustomButton';

interface IInvitationProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  listId: number;
}

export default function Invitation({
  isVisible,
  setIsVisible,
  listId,
}: IInvitationProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Invitation');
  const [invitation, setInvitation] = useState<IInvitation>();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, setIsVisible]);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const invitationCode = await createInvitation(listId);
        if (invitationCode.expiresAt) {
          invitationCode.expiresAt = new Date(invitationCode.expiresAt);
        }
        setInvitation(invitationCode);
      } catch (error) {
        console.error('Error fetching invitation:', error);
      }
    };
    if (isVisible) {
      fetchInvitation();
    }
  }, [listId, isVisible]);

  const handleCopy = () => {
    if (invitation) {
      navigator.clipboard.writeText(invitation?.code);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.overlay__invitation} ref={modalRef}>
        <div className={styles.overlay__invitation__upperContainer}>
          <div
            className={styles.overlay__invitation__upperContainer__placeholder}
          />
          <p>{t('invitation-code')}</p>
          <IoClose onClick={() => setIsVisible(false)} size={40} />
        </div>
        <div className={styles.overlay__invitation__lowerContainer}>
          {!invitation ? (
            <Loader />
          ) : (
            <div
              className={
                styles.overlay__invitation__lowerContainer__invitationContainer
              }
            >
              <div
                className={
                  styles.overlay__invitation__lowerContainer__invitationContainer__code
                }
              >
                {invitation?.code}
              </div>

              <div
                className={
                  styles.overlay__invitation__lowerContainer__invitationContainer__expiresAt
                }
              >
                {t('expires-at')}:{' '}
                {invitation?.expiresAt.toLocaleDateString() +
                  ' ' +
                  invitation?.expiresAt.toLocaleTimeString().slice(0, 5)}
              </div>

              <CustomButton
                onClick={handleCopy}
                className={`${
                  styles.overlay__invitation__lowerContainer__invitationContainer__copyButton
                } ${
                  isCopied
                    ? styles[
                        'overlay__invitation__lowerContainer__invitationContainer__copyButton--copied'
                      ]
                    : ''
                }`}
                disabled={isCopied}
              >
                {isCopied ? t('copied') : t('copy-code')}
              </CustomButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
