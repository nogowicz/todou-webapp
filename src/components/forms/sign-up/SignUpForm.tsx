'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signUpSchema } from './validationSchema';
import axios from 'axios';

import styles from './sign-up-form.module.scss';
import CustomInput from '@/components/custom-input/CustomInput';
import { IoKeyOutline, IoPersonOutline } from 'react-icons/io5';
import { FiMail } from 'react-icons/fi';
import CustomButton from '@/components/custom-button/CustomButton';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import { FormType } from '../form-switcher/FormSwitcher';
import { useUser } from '@/app/utils/Providers/UserProvider';

interface ISignUpForm {
  setCurrentForm: Dispatch<SetStateAction<FormType>>;
}

interface Inputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignUpForm({ setCurrentForm }: ISignUpForm) {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const { mounted, theme } = useMountedTheme();
  const themeClass = theme ? styles[theme] : '';

  if (!mounted) {
    return null;
  }

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
      if (error instanceof Error) {
        setError('email', { message: error.message || 'An error occurred' });
      }
    }
  };

  return (
    <form
      className={`${styles.form} ${themeClass}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.form__textFields}>
        <CustomInput
          label="First Name"
          placeholder="John"
          icon={<IoPersonOutline />}
          type="firstName"
          id="firstName"
          error={errors.firstName}
          {...register('firstName', { required: 'This field is required' })}
        />

        <CustomInput
          label="Last Name"
          placeholder="Doe"
          icon={<IoPersonOutline />}
          type="lastName"
          id="lastName"
          error={errors.lastName}
          {...register('lastName', { required: 'This field is required' })}
        />

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
          id="password"
          error={errors.password}
          {...register('password', { required: 'This field is required' })}
        />
        <CustomInput
          label="Confirm Password"
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
      <CustomButton isLoading={isLoading} type="submit">
        Sign Up
      </CustomButton>
      <p className={styles.form__signInToAccount}>
        Already have an account?{' '}
        <span onClick={() => setCurrentForm(FormType['sign-in'])}>Sign in</span>{' '}
        here!
      </p>
    </form>
  );
}
