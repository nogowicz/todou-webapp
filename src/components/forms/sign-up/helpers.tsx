import CustomButton from '@/components/custom-button/CustomButton';
import CustomInput from '@/components/custom-input/CustomInput';
import React, { Dispatch, SetStateAction } from 'react';
import { FiMail } from 'react-icons/fi';
import { IoKeyOutline, IoPersonOutline } from 'react-icons/io5';

import styles from './sign-up-form.module.scss';
import { FieldErrors } from 'react-hook-form';
export interface IPrepareSignUpForm {
  errors: FieldErrors<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>;
  register: Function;
  isLoading: boolean;
  setPage: Dispatch<SetStateAction<number>>;
  t: Function;
}

export default function PrepareSignUpForm({
  errors,
  register,
  isLoading,
  setPage,
  t,
}: IPrepareSignUpForm) {
  return [
    {
      id: 'credentials',
      forms: (
        <div id="credentials">
          <CustomInput
            label={t('email')}
            placeholder="johndoe@todou.com"
            icon={<FiMail />}
            type="email"
            id="email"
            error={errors.email}
            {...register('email', { required: 'This field is required' })}
          />

          <CustomInput
            label={t('password')}
            placeholder="********"
            icon={<IoKeyOutline />}
            type="password"
            isPasswordField
            id="password"
            error={errors.password}
            {...register('password', { required: 'This field is required' })}
          />

          <CustomInput
            label={t('confirm-password')}
            placeholder="********"
            icon={<IoKeyOutline />}
            type="password"
            isPasswordField
            id="confirmPassword"
            error={errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'This field is required',
            })}
          />
        </div>
      ),
      buttons: (
        <>
          <CustomButton
            type="button"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setPage(1);
            }}
          >
            {t('next')}
          </CustomButton>
        </>
      ),
    },
    {
      id: 'personal-info',
      forms: (
        <>
          <CustomInput
            label={t('first-name')}
            placeholder="John"
            icon={<IoPersonOutline />}
            type="firstName"
            id="firstName"
            error={errors.firstName}
            {...register('firstName', { required: 'This field is required' })}
          />

          <CustomInput
            label={t('last-name')}
            placeholder="Doe"
            icon={<IoPersonOutline />}
            type="lastName"
            id="lastName"
            error={errors.lastName}
            {...register('lastName', { required: 'This field is required' })}
          />
        </>
      ),
      buttons: (
        <div className={styles.form__buttonsContainer}>
          <CustomButton variant="secondary" onClick={() => setPage(0)}>
            {t('back')}
          </CustomButton>
          <CustomButton isLoading={isLoading} type="submit">
            {t('sign-up')}
          </CustomButton>
        </div>
      ),
    },
  ];
}
