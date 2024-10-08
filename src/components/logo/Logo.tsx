import Image from 'next/image';
import React from 'react';
import LogoSvg from '/public/logo.svg';

import styles from './logo.module.scss';
import { useTranslations } from 'next-intl';

interface ILogo {
  welcomeScreen?: boolean;
  width?: number;
}

const Logo: React.FC<ILogo> = ({ welcomeScreen = false, width = 300 }) => {
  const t = useTranslations('WelcomePage');
  return (
    <div className={styles.logo}>
      {welcomeScreen && <h2 className={styles.logo__title}>{t('welcome')}</h2>}
      <div
        className={`${styles.logo__imageWrapper} ${
          welcomeScreen ? styles.logo__welcomeLogo : {}
        }`}
      >
        <Image src={LogoSvg} alt="Todou Logo" width={width} />
      </div>
    </div>
  );
};

export default Logo;
