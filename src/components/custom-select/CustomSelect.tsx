import React, { ComponentType, useState } from 'react';
import Select, { GroupBase, OptionProps, SingleValueProps } from 'react-select';

interface ICustomSelectProps<T> {
  data: T[];
  Option: ComponentType<OptionProps<T, false, GroupBase<T>>> | undefined;
  SingleValue:
    | ComponentType<SingleValueProps<T, false, GroupBase<T>>>
    | undefined;
}

export default function CustomSelect<T>({
  data,
  Option,
  SingleValue,
}: ICustomSelectProps<T>) {
  const [selectedData, setSelectedData] = useState<T | null>(data[0]);

  const handleChange = (value: T | null) => {
    setSelectedData(value);
  };

  return (
    <Select<T>
      className="react-select"
      classNamePrefix="react-select"
      value={selectedData}
      options={data}
      onChange={handleChange}
      isSearchable={false}
      components={{
        Option,
        SingleValue,
      }}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          borderRadius: 10,
          color: 'var(--text)',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          border: 0,
          boxShadow: 'none',
          minWidth: 200,
          '&:hover': {
            border: 0,
            cursor: 'pointer',
          },
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: 'var(--background)',
          borderRadius: 10,
          color: 'var(--text)',
          fontSize: 18,
        }),
        option: (base) => ({
          ...base,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--background)',
          gap: 20,
          '&:hover': {
            cursor: 'pointer',
          },
        }),
        singleValue: (base) => ({
          ...base,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          color: 'var(--text)',
          fontSize: 18,
          padding: '5px 0',
        }),
        indicatorSeparator: (base) => ({
          ...base,
          display: 'none',
        }),
        dropdownIndicator: (base) => ({
          ...base,
          color: 'var(--text)',
        }),
        menuList: (base) => ({
          ...base,
          padding: 0,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }),
      }}
    />
  );
}
