import Image from 'next/image';
import React from 'react';
import LogoSvg from '/public/logo.svg';

import styles from './logo.module.scss';

interface ILogo {
  welcomeScreen: boolean;
}

const Logo: React.FC<ILogo> = ({ welcomeScreen }) => {
  return (
    <div className={styles.logo}>
      {welcomeScreen && <h2 className={styles.logo__title}>Welcome to</h2>}
      <div className={styles.logo__imageWrapper}>
        <Image src={LogoSvg} alt="Todou Logo" width={300} />
      </div>
    </div>
  );
};

export default Logo;
