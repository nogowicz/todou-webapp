import React, { useEffect, useState } from 'react';

import styles from './invitation.module.scss';
import { useTranslations } from 'next-intl';
import { createInvitation, verifyInvitation } from '@/actions/Invitation';
import { IInvitation } from '@/types/Invitation';
import Loader from '../loader/Loader';
import CustomButton from '../custom-button/CustomButton';
import Modal from '../modal/Modal';

interface IInvitationProps {
  isVisible: boolean;
  onCloseInvitationModal: () => void;
  listId?: number;
  isInsertInvitation?: boolean;
}

export default function Invitation({
  isVisible,
  onCloseInvitationModal,
  listId,
  isInsertInvitation = false,
}: IInvitationProps) {
  const t = useTranslations('Invitation');
  const [invitation, setInvitation] = useState<IInvitation>();
  const [isCopied, setIsCopied] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

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
    if (invitation.error) {
      setError(invitation.error);
    }
    if (!invitation.error) {
      onCloseInvitationModal();
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={onCloseInvitationModal}
      title={isInsertInvitation ? t('insert-invitation') : t('invitation-code')}
    >
      <div className={styles.invitation}>
        {isInsertInvitation ? (
          <div className={styles.invitation__invitationContainer}>
            <div
              className={styles.invitation__invitationContainer__inputContainer}
            >
              <input
                type="number"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={'123456'}
                className={`${
                  styles.invitation__invitationContainer__inputContainer__input
                } ${
                  error
                    ? styles[
                        'invitation__invitationContainer__inputContainer__input--error'
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
                    styles.invitation__invitationContainer__inputContainer__error
                  }
                >
                  {error}
                </p>
              )}
            </div>
            <CustomButton
              onClick={handleSubmit}
              className={styles.invitation__invitationContainer__submitButton}
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
              <div className={styles.invitation__invitationContainer}>
                <div className={styles.invitation__invitationContainer__code}>
                  {invitation?.code}
                </div>

                <div
                  className={styles.invitation__invitationContainer__expiresAt}
                >
                  {t('expires-at')}:{' '}
                  {invitation?.expiresAt.toLocaleDateString() +
                    ' ' +
                    invitation?.expiresAt.toLocaleTimeString().slice(0, 5)}
                </div>

                <CustomButton
                  onClick={handleCopy}
                  className={`${
                    styles.invitation__invitationContainer__copyButton
                  } ${
                    isCopied
                      ? styles[
                          'invitation__invitationContainer__copyButton--copied'
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
    </Modal>
  );
}
