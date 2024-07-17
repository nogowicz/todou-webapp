import React, { ReactElement, ReactNode } from 'react';
import { BsCart2 } from 'react-icons/bs';
import { CiShoppingBasket } from 'react-icons/ci';
import { GoChecklist } from 'react-icons/go';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { IoMdHeartEmpty } from 'react-icons/io';
import { LuPlane } from 'react-icons/lu';
import { MdOutlineWorkOutline } from 'react-icons/md';

export const listIconTheme: Record<number, ReactElement> = {
  0: <GoChecklist />,
  1: <CiShoppingBasket />,
  2: <BsCart2 />,
  3: <IoMdHeartEmpty />,
  4: <HiOutlineComputerDesktop />,
  5: <LuPlane />,
  6: <MdOutlineWorkOutline />,
};

export const listColorTheme: Record<number, string> = {
  0: '#0860FB',
  1: '#4DA2F5',
  2: '#F7917D',
  3: '#58CB7B',
  4: '#AA69C4',
  5: '#8F86C9',
  6: '#FFD700',
};
