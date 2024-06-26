import Logo from '@/components/logo/Logo';
import React from 'react';

import WelcomeAnimation from '@/assets/animations/welcome-animation.json';
import LottieAnimation from '@/components/lottie-animation/LottieAnimation';

import styles from './page.module.scss';
import SignInForm from '@/components/sign-in-form/SignInForm';

export default function welcome() {
  return (
    <main className={styles.welcome}>
      <h1 className={styles.welcome__title}>Todou</h1>
      <div className={styles.welcome__container}>
        <div className={styles.welcome__container__left}>
          <Logo welcomeScreen />
          <LottieAnimation
            animationData={WelcomeAnimation}
            style={{ width: '500px', height: '500px' }}
          />
          <p>
            Welcome to Todou - your new companion in task organization! Todou
            helps you effortlessly manage shopping lists, tasks, and projects.
            Start using Todou today!
          </p>
        </div>
        <div className={styles.welcome__container__right}>
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
