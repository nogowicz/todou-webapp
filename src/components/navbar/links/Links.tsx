import { CiViewList } from 'react-icons/ci';
import { IoHomeOutline, IoSearch } from 'react-icons/io5';
import { useLocale } from 'next-intl';

import NavbarLink from '../navbar-link/NavbarLink';

import EisenhowerMatrixIcon from '@/components/eisenhower-matrix-icon/EisenhowerMatrixIcon';

const ICON_SIZE = 24;

interface IMenuItems {
  t: Function;
  isMobile?: boolean;
}

export default function MenuItems({ t, isMobile = false }: IMenuItems) {
  const locale = useLocale();

  const menuItems = [
    {
      name: t('dashboard'),
      icon: <IoHomeOutline size={ICON_SIZE} />,
      href: `/${locale}`,
      exact: true,
    },
    {
      name: t('lists'),
      icon: <CiViewList size={ICON_SIZE} />,
      href: `/${locale}/lists`,
      exact: false,
    },
    {
      name: t('eisenhower-matrix'),
      icon: <EisenhowerMatrixIcon />,
      href: `/${locale}/matrix`,
      exact: false,
    },
    {
      name: t('search'),
      icon: <IoSearch size={ICON_SIZE} />,
      href: `/${locale}/search`,
      exact: false,
    },
  ];

  if (isMobile) {
    return (
      <>
        {menuItems.map((item, index) => (
          <NavbarLink key={index} href={item.href} exact={item.exact}>
            {item.icon}
          </NavbarLink>
        ))}
      </>
    );
  }

  return (
    <>
      {menuItems.map((item, index) => (
        <NavbarLink key={index} href={item.href} exact={item.exact}>
          {item.icon}
          {item.name}
        </NavbarLink>
      ))}
    </>
  );
}
