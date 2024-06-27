'use client';

import React from 'react';
import CustomInput from '../custom-input/CustomInput';
import { FiMail } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';
import CustomButton from '../custom-button/CustomButton';

import styles from './sign-in-form.module.scss';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from './validationSchema';

interface Inputs {
  email: string;
  password: string;
}

export default function SignInForm() {
  const { mounted, theme } = useMountedTheme();
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
    console.log('Form submitted with data:', data);
    try {
      console.log('LOGIN DATA: ', data);
      // Perform the login logic here
      // If you have a mock API call, you can add it here
    } catch (error: any) {
      console.log('Error occurred:', error);
      if (error.message === 'Incorrect email or password') {
        setError('email', { type: 'manual', message: error.message });
        setError('password', { type: 'manual', message: error.message });
      } else {
        console.log(error);
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
          placeholder="johndoe@todou.com"
          icon={<FiMail />}
          type="email"
          id="email"
          error={errors.email}
          {...register('email', { required: 'This field is required' })}
        />

        <CustomInput
          placeholder="********"
          icon={<IoKeyOutline />}
          type="password"
          isPasswordField
          actionLabel="Forgot Password?"
          actionRoute="/forgot-password"
          id="password"
          error={errors.password}
          {...register('password', { required: 'This field is required' })}
        />
      </div>
      <CustomButton type="submit">Sign In</CustomButton>
      <p className={styles.form__createAccount}>
        Don’t have an account yet? <span>Sign up</span> here!
      </p>
    </form>
  );
}
