'use client';

import { CiViewList } from 'react-icons/ci';
import { IoHomeOutline, IoSearch } from 'react-icons/io5';
import EisenhowerMatrixIcon from '@/components/eisenhower-matrix-icon/EisenhowerMatrixIcon';
import { useLocale, useTranslations } from 'next-intl';

const ICON_SIZE = 24;

const useMainMenu = () => {
  const locale = useLocale();
  const t = useTranslations('NavigationComponent');

  return [
    {
      name: t('dashboard'),
      icon: <IoHomeOutline size={ICON_SIZE} />,
      href: `/${locale}`,
    },
    {
      name: t('lists'),
      icon: <CiViewList size={ICON_SIZE} />,
      href: `/${locale}/lists`,
    },
    {
      name: t('eisenhower-matrix'),
      icon: <EisenhowerMatrixIcon />,
      href: `/${locale}/matrix`,
    },
    {
      name: t('search'),
      icon: <IoSearch size={ICON_SIZE} />,
      href: `/${locale}/search`,
    },
  ];
};

export default useMainMenu;
