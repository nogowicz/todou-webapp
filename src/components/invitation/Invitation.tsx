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
import { createInvitation, verifyInvitation } from '@/actions/Invitation';
import { IInvitation } from '@/types/Invitation';
import Loader from '../loader/Loader';
import CustomButton from '../custom-button/CustomButton';

interface IInvitationProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  listId?: number;
  isInsertInvitation?: boolean;
}

export default function Invitation({
  isVisible,
  setIsVisible,
  listId,
  isInsertInvitation = false,
}: IInvitationProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Invitation');
  const [invitation, setInvitation] = useState<IInvitation>();
  const [isCopied, setIsCopied] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

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
        if (!listId) return;
        const invitationCode = await createInvitation(listId);
        if (invitationCode.expiresAt) {
          invitationCode.expiresAt = new Date(invitationCode.expiresAt);
        }
        setInvitation(invitationCode);
      } catch (error) {
        console.error('Error fetching invitation:', error);
      }
    };
    if (isVisible && listId) {
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

  const handleSubmit = async () => {
    const invitation = await verifyInvitation(code);
    console.log(invitation);
    if (invitation.error) {
      setError(invitation.error);
    }
    if (!invitation.error) {
      setIsVisible(false);
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
          <p className={styles.overlay__invitation__upperContainer__error}>
            {isInsertInvitation ? t('insert-invitation') : t('invitation-code')}
          </p>
          <IoClose onClick={() => setIsVisible(false)} size={40} />
        </div>
        <div className={styles.overlay__invitation__lowerContainer}>
          {isInsertInvitation ? (
            <div
              className={
                styles.overlay__invitation__lowerContainer__invitationContainer
              }
            >
              <div
                className={
                  styles.overlay__invitation__lowerContainer__invitationContainer__inputContainer
                }
              >
                <input
                  type="number"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={'123456'}
                  className={`${
                    styles.overlay__invitation__lowerContainer__invitationContainer__inputContainer__input
                  } ${
                    error
                      ? styles[
                          'overlay__invitation__lowerContainer__invitationContainer__inputContainer__input--error'
                        ]
                      : ''
                  }`}
                  onInput={(e: any) => {
                    if (e.target.value.length > e.target.maxLength)
                      e.target.value = e.target.value.slice(
                        0,
                        e.target.maxLength
                      );
                  }}
                />
                {error && (
                  <p
                    className={
                      styles.overlay__invitation__lowerContainer__invitationContainer__inputContainer__error
                    }
                  >
                    {error}
                  </p>
                )}
              </div>
              <CustomButton
                onClick={handleSubmit}
                className={
                  styles.overlay__invitation__lowerContainer__invitationContainer__submitButton
                }
                disabled={code.length !== 6}
              >
                {t('submit')}
              </CustomButton>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
