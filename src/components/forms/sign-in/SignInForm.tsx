'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import CustomInput from '../../custom-input/CustomInput';
import { FiMail } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';
import CustomButton from '../../custom-button/CustomButton';

import { useMountedTheme } from '@/hooks/useMountedTheme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from './validationSchema';

import styles from './sign-in-form.module.scss';
import { FormType } from '../form-switcher/FormSwitcher';
import axios from 'axios';
import { useUser } from '@/app/utils/Providers/UserProvider';

interface ISignInForm {
  setCurrentForm: Dispatch<SetStateAction<FormType>>;
}

interface Inputs {
  email: string;
  password: string;
}

export default function SignInForm({ setCurrentForm }: ISignInForm) {
  const { login } = useUser();
  const { mounted, theme } = useMountedTheme();

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(signInSchema),
  });

  const themeClass = theme ? styles[theme] : '';

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
        const errorMessage = errorResponse.message || 'Failed to sign in';
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
          label="Email"
          placeholder="johndoe@todou.com"
          icon={<FiMail />}
          type="email"
          id="email"
          error={errors.email}
          {...register('email', { required: 'This field is required' })}
        />

        <CustomInput
          label="Password"
          placeholder="********"
          icon={<IoKeyOutline />}
          type="password"
          isPasswordField
          actionLabel="Forgot Password?"
          action={() => setCurrentForm(FormType['forgot-password'])}
          id="password"
          error={errors.password}
          {...register('password', { required: 'This field is required' })}
        />
      </div>
      <CustomButton type="submit" isLoading={isLoading}>
        Sign In
      </CustomButton>
      <p className={styles.form__createAccount}>
        Don’t have an account yet?{' '}
        <span onClick={() => setCurrentForm(FormType['sign-up'])}>Sign up</span>{' '}
        here!
      </p>
    </form>
  );
}
