import { CiViewList } from 'react-icons/ci';
import { IoHomeOutline, IoSearch } from 'react-icons/io5';
import EisenhowerMatrixIcon from '@/components/eisenhower-matrix-icon/EisenhowerMatrixIcon';
import { getTranslations } from 'next-intl/server';
import NavbarLink from '../navbar-link/NavbarLink';
import { useLocale } from 'next-intl';

const ICON_SIZE = 24;

const MenuItems = async () => {
  const locale = useLocale();
  const t = await getTranslations('NavigationComponent');

  const menuItems = [
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

  return (
    <>
      {menuItems.map((item, index) => (
        <NavbarLink key={index} href={item.href}>
          {item.icon}
          {item.name}
        </NavbarLink>
      ))}
    </>
  );
};

export default MenuItems;
