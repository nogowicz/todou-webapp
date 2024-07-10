'use client';

import { CiViewList } from 'react-icons/ci';
import { IoHomeOutline, IoSearch } from 'react-icons/io5';

import EisenhowerMatrixIcon from '@/components/eisenhower-matrix-icon/EisenhowerMatrixIcon';

const ICON_SIZE = 24;

export const mainMenu = [
  {
    name: 'Dashboard',
    icon: <IoHomeOutline size={ICON_SIZE} />,
    href: '/',
  },
  {
    name: 'Lists',
    icon: <CiViewList size={ICON_SIZE} />,
    href: '/lists',
  },
  {
    name: 'Eisenhower Matrix',
    icon: <EisenhowerMatrixIcon />,
    href: '/matrix',
  },
  {
    name: 'Search',
    icon: <IoSearch size={ICON_SIZE} />,
    href: '/search',
  },
];
