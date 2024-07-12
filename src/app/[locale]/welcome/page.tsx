import React from 'react';

import Logo from '@/components/logo/Logo';
import LottieAnimation from '@/components/lottie-animation/LottieAnimation';
import FormSwitcher from '@/components/forms/form-switcher/FormSwitcher';

import WelcomeAnimation from '@/assets/animations/welcome-animation1.json';

import styles from './page.module.scss';
import { useTranslations } from 'next-intl';

const animationSize = '450px';

export default function Welcome() {
  const t = useTranslations('WelcomePage');
  return (
    <main className={styles.welcome}>
      <h1 className={styles.welcome__title}>Todou</h1>
      <div className={styles.welcome__container}>
        <div className={styles.welcome__container__left}>
          <Logo welcomeScreen />
          <LottieAnimation
            animationData={WelcomeAnimation}
            style={{ width: animationSize, height: animationSize }}
          />
          <p>{t('subtitle')}</p>
        </div>
        <div className={styles.welcome__container__right}>
          <div className={styles.welcome__container__right__logo}>
            <Logo />
          </div>
          <div className={styles.welcome__container__right__placeholder} />
          <FormSwitcher />
          <p className={styles.welcome__container__right__terms}>
            {t('by-clicking')} <span>{t('terms-and-conditions')}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
