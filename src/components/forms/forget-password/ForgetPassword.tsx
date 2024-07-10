import CustomButton from '@/components/custom-button/CustomButton';
import CustomInput from '@/components/custom-input/CustomInput';
import React, { Dispatch, SetStateAction } from 'react';
import { FiMail } from 'react-icons/fi';
import { FormType } from '../form-switcher/FormSwitcher';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import { forgetPasswordSchema } from './validationSchema';

import styles from './forget-password.module.scss';

interface IForgetPassword {
  setCurrentForm: Dispatch<SetStateAction<FormType>>;
}

interface Inputs {
  email: string;
}

export default function ForgetPassword({ setCurrentForm }: IForgetPassword) {
  const { mounted, resolvedTheme } = useMountedTheme();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const themeClass = resolvedTheme ? styles[resolvedTheme] : '';

  if (!mounted) {
    return null;
  }

  const onSubmit = async (data: Inputs) => {
    try {
      console.log('DATA: ', data);
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error occurred:', error);
        if (error.message === 'Incorrect email or password') {
          setError('email', { type: 'manual', message: error.message });
        } else {
          console.log(error);
        }
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
      </div>
      <div className={styles.form__buttonsContainer}>
        <CustomButton
          variant="secondary"
          onClick={() => setCurrentForm(FormType['sign-in'])}
        >
          Back
        </CustomButton>
        <CustomButton type="submit">Sign Up</CustomButton>
      </div>
      <p className={styles.form__createAccount}>
        Don’t have an account yet?{' '}
        <span onClick={() => setCurrentForm(FormType['sign-up'])}>Sign up</span>{' '}
        here!
      </p>
    </form>
  );
}
