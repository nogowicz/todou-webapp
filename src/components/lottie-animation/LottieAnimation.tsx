'use client';

import dynamic from 'next/dynamic';
import React, { CSSProperties, useEffect, useState } from 'react';

const DynamicLottie = dynamic(() => import('lottie-react'), { ssr: false });

interface ILottieAnimationProps {
  animationData: any;
  style?: CSSProperties;
  loop?: boolean;
}

const LottieAnimation: React.FC<ILottieAnimationProps> = ({
  animationData,
  style,
  loop = true,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <DynamicLottie animationData={animationData} style={style} loop={loop} />
  );
};

export default LottieAnimation;
