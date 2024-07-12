'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import CustomInput from '../../custom-input/CustomInput';
import { FiMail } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';
import CustomButton from '../../custom-button/CustomButton';

import { useMountedTheme } from '@/hooks/useMountedTheme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSignInSchema } from './validationSchema';

import styles from './sign-in-form.module.scss';
import { FormType } from '../form-switcher/FormSwitcher';
import axios from 'axios';
import { useUser } from '@/app/[locale]/utils/Providers/UserProvider';
import { useTranslations } from 'next-intl';
interface ISignInForm {
  setCurrentForm: Dispatch<SetStateAction<FormType>>;
}

interface Inputs {
  email: string;
  password: string;
}

export default function SignInForm({ setCurrentForm }: ISignInForm) {
  const { login } = useUser();
  const { mounted, resolvedTheme } = useMountedTheme();
  const t = useTranslations('WelcomePage');
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(getSignInSchema(t)),
  });

  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';

  if (!mounted) {
    return null;
  }

  const onSubmit = async (data: Inputs) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/user/sign-in', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = response.data;

      if (responseData) {
        login(responseData);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response.data;
        const errorMessage = errorResponse.message || t('filed-to-sign-in');
        console.log(errorMessage);
        setError('email', { type: 'manual', message: errorMessage });
        setError('password', { type: 'manual', message: errorMessage });
      } else {
        console.log(error);
      }
    }
  };

  return (
    <form
      className={`${styles.form} ${themeClass}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.form__textFields}>
        <CustomInput
          label={t('email')}
          placeholder="johndoe@todou.com"
          icon={<FiMail />}
          type="email"
          id="email"
          error={errors.email}
          {...register('email', { required: t('required-field') })}
        />

        <CustomInput
          label={t('password')}
          placeholder="********"
          icon={<IoKeyOutline />}
          type="password"
          isPasswordField
          actionLabel={t('forgot-password')}
          action={() => setCurrentForm(FormType['forgot-password'])}
          id="password"
          error={errors.password}
          {...register('password', { required: t('required-field') })}
        />
      </div>
      <CustomButton type="submit" isLoading={isLoading}>
        {t('sign-in')}
      </CustomButton>
      <p className={styles.form__createAccount}>
        {t('dont-have-an-account')}{' '}
        <span onClick={() => setCurrentForm(FormType['sign-up'])}>
          {t('sign-up')}
        </span>{' '}
        {t('here')}
      </p>
    </form>
  );
}
