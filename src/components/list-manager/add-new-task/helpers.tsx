import {
  listColorTheme,
  listIconTheme,
} from '@/components/list-item/ListStyles';
import { IList } from '@/types/List';
import { ITaskImportance, ITaskUrgency } from '@/types/Task';
import { useTranslations } from 'next-intl';
import { cloneElement } from 'react';
import { OptionProps, SingleValueProps, components } from 'react-select';

const ICON_SIZE = 40;

export const ListOption = (props: OptionProps<IList, false>) => {
  return (
    <components.Option {...props}>
      {cloneElement(listIconTheme[props.data.iconId], {
        size: ICON_SIZE * 0.8,
        color: listColorTheme[props.data.colorVariant],
      })}
      {props.data.listName}
    </components.Option>
  );
};

export const ListSingleValue = ({
  children,
  ...props
}: SingleValueProps<IList, false>) => (
  <components.SingleValue {...props}>
    {cloneElement(listIconTheme[props.data.iconId], {
      size: ICON_SIZE * 0.8,
      color: listColorTheme[props.data.colorVariant],
    })}
    {props.data.listName}
    {children}
  </components.SingleValue>
);

export const ImportanceOption = (
  props: OptionProps<ITaskImportance, false>
) => {
  const t = useTranslations('ListPage');
  return (
    <components.Option {...props}>
      {cloneElement(props.data.icon, { size: ICON_SIZE * 0.8 })}
      {t(props.data.translationKey)}
    </components.Option>
  );
};

export const ImportanceSingleValue = ({
  children,
  ...props
}: SingleValueProps<ITaskImportance, false>) => {
  const t = useTranslations('ListPage');
  return (
    <components.SingleValue {...props}>
      {cloneElement(props.data.icon, { size: ICON_SIZE * 0.8 })}
      {t(props.data.translationKey)}
      {children}
    </components.SingleValue>
  );
};

export const UrgencyOption = (props: OptionProps<ITaskUrgency, false>) => {
  const t = useTranslations('ListPage');
  return (
    <components.Option {...props}>
      {cloneElement(props.data.icon, { size: ICON_SIZE * 0.8 })}
      {t(props.data.translationKey)}
    </components.Option>
  );
};

export const UrgencySingleValue = ({
  children,
  ...props
}: SingleValueProps<ITaskUrgency, false>) => {
  const t = useTranslations('ListPage');
  return (
    <components.SingleValue {...props}>
      {cloneElement(props.data.icon, { size: ICON_SIZE * 0.8 })}
      {t(props.data.translationKey)}
      {children}
    </components.SingleValue>
  );
};
