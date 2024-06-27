'use client';

import React from 'react';
import CustomInput from '../custom-input/CustomInput';
import { FiMail } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';
import CustomButton from '../custom-button/CustomButton';

import styles from './sign-in-form.module.scss';
import { useMountedTheme } from '@/hooks/useMountedTheme';

export default function SignInForm() {
  const { mounted, theme } = useMountedTheme();
  const themeClass = theme ? styles[theme] : '';

  if (!mounted) {
    return null;
  }

  return (
    <form className={`${styles.form} ${themeClass}`}>
      <div className={styles.form__textFields}>
        <CustomInput
          name="Email"
          placeholder="johndoe@todou.com"
          icon={<FiMail />}
          type="email"
        />
        <CustomInput
          name="Password"
          placeholder="********"
          icon={<IoKeyOutline />}
          type="password"
          isPasswordField
          actionLabel="Forgot Password?"
          actionRoute="/forgot-password"
        />
      </div>
      <CustomButton>Sign In</CustomButton>
      <p className={styles.form__createAccount}>
        Don’t have an account yet? <span>Sign up</span> here!
      </p>
    </form>
  );
}
