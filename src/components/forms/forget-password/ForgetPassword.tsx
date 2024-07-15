import React, { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';
import { FiMail } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { getForgetPasswordSchema } from './validationSchema';
import { FormType } from '../form-switcher/FormSwitcher';
import CustomButton from '@/components/custom-button/CustomButton';
import CustomInput from '@/components/custom-input/CustomInput';

import styles from './forget-password.module.scss';

interface IForgetPassword {
  setCurrentForm: Dispatch<SetStateAction<FormType>>;
}

interface Inputs {
  email: string;
}

export default function ForgetPassword({ setCurrentForm }: IForgetPassword) {
  const t = useTranslations('WelcomePage');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(getForgetPasswordSchema(t)),
  });

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
      className={`${styles.form}`}
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
