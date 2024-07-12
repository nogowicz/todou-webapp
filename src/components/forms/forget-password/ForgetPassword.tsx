import CustomButton from '@/components/custom-button/CustomButton';
import CustomInput from '@/components/custom-input/CustomInput';
import React, { Dispatch, SetStateAction } from 'react';
import { FiMail } from 'react-icons/fi';
import { FormType } from '../form-switcher/FormSwitcher';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import { getForgetPasswordSchema } from './validationSchema';

import styles from './forget-password.module.scss';
import { useTranslations } from 'next-intl';

interface IForgetPassword {
  setCurrentForm: Dispatch<SetStateAction<FormType>>;
}

interface Inputs {
  email: string;
}

export default function ForgetPassword({ setCurrentForm }: IForgetPassword) {
  const t = useTranslations('WelcomePage');
  const { mounted, resolvedTheme } = useMountedTheme();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(getForgetPasswordSchema(t)),
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
        if (error.message === 'Incorrect email') {
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
          label={t('email')}
          placeholder="johndoe@todou.com"
          icon={<FiMail />}
          type="email"
          id="email"
          error={errors.email}
          {...register('email', { required: t('required-field') })}
        />
      </div>
      <div className={styles.form__buttonsContainer}>
        <CustomButton
          variant="secondary"
          onClick={() => setCurrentForm(FormType['sign-in'])}
        >
          {t('back')}
        </CustomButton>
        <CustomButton type="submit">{t('sign-up')}</CustomButton>
      </div>
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
