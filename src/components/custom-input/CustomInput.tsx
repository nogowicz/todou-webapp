'use client';

import React, { cloneElement, useState } from 'react';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import styles from './custom-input.module.scss';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Link from 'next/link';

interface ICustomInput {
  name: string;
  placeholder?: string;
  icon?: JSX.Element;
  type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  isPasswordField?: boolean;
  error?:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>
    | undefined;
  actionRoute?: string;
  actionLabel?: string;
}

const iconSize = 30;

export default function CustomInput({
  name,
  placeholder,
  icon,
  type,
  isPasswordField = false,
  error,
  actionRoute,
  actionLabel,
}: ICustomInput) {
  const { mounted, theme } = useMountedTheme();
  const [focus, setFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const themeClass = theme ? styles[theme] : '';

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`${styles.customInput} ${themeClass} ${
        focus ? styles.focused : styles.notFocused
      }
        ${error ? styles.error : styles.noError}`}
    >
      <div className={styles.customInput__labelContainer}>
        <label className={styles.customInput__labelContainer__label}>
          {name}
        </label>
        {actionLabel && actionRoute && (
          <Link href={actionRoute}>{actionLabel}</Link>
        )}
      </div>
      <div className={styles.customInput__inputContainer}>
        {icon &&
          cloneElement(icon, {
            height: iconSize,
            width: iconSize,
            className: `${styles.customInput__inputContainer__icon}`,
          })}
        <input
          className={styles.customInput__inputContainer__input}
          name={name}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          type={showPassword ? 'text' : type}
        />
        {isPasswordField &&
          (showPassword ? (
            <IoEyeOutline
              size={iconSize}
              className={styles.customInput__inputContainer__icon}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEyeOffOutline
              size={iconSize}
              className={styles.customInput__inputContainer__icon}
              onClick={() => setShowPassword(true)}
            />
          ))}
      </div>
      {error && error.message && (
        <p className={styles.customInput__error}>{error.message.toString()}</p>
      )}
    </div>
  );
}
