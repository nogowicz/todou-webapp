'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { TranslationValues, useTranslations } from 'next-intl';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { getSignUpSchema } from './validationSchema';
import { FormType } from '../form-switcher/FormSwitcher';

import Pagination from '@/components/pagination/Pagination';
import PrepareSignUpForm, { IPrepareSignUpForm } from './helpers';

import styles from './sign-up-form.module.scss';
import { useUser } from '@/utils/Providers/UserProvider';
interface Inputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface ISignUpForm {
  setCurrentForm: Dispatch<SetStateAction<FormType>>;
}

export interface IPages {
  id: string;
  forms: JSX.Element;
  buttons: JSX.Element;
}

export default function SignUpForm({ setCurrentForm }: ISignUpForm) {
  const t = useTranslations('WelcomePage');
  const [page, setPage] = useState(0);

  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSignUpSchema(t)),
  });

  const onSubmit = async (data: Inputs) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/user/sign-up', data, {
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
        const errorMessage = errorResponse.message || 'Failed to sign in';
        setPage(0);
        setError('email', { message: errorMessage || 'An error occurred' });
      } else {
        console.log(error);
      }
    }
  };

  const pages: IPages[] = PrepareSignUpForm({
    errors,
    register,
    isLoading,
    setPage,
    t,
  });

  return (
    <form
      className={`${styles.form}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.form__inputsContainer}>{pages[page].forms}</div>
      <Pagination pages={pages} activePage={page} setPage={setPage} />
      {pages[page].buttons}
      <p className={styles.form__signInToAccount}>
        {t('have-an-account')}{' '}
        <span onClick={() => setCurrentForm(FormType['sign-in'])}>
          {t('sign-in')}
        </span>{' '}
        {t('here')}
      </p>
    </form>
  );
}
