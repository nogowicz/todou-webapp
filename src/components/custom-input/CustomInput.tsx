'use client';

import React, { cloneElement, forwardRef, useState } from 'react';
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
  [key: string]: any;
}

const iconSize = 30;

const CustomInput = forwardRef<HTMLInputElement, ICustomInput>(
  (
    {
      name,
      placeholder,
      icon,
      type,
      isPasswordField = false,
      error,
      actionRoute,
      actionLabel,
      ...props
    },
    ref
  ) => {
    const { mounted, theme } = useMountedTheme();
    const [focus, setFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const themeClass = theme ? styles[theme] : '';

    if (!mounted) {
      return null;
    }

    function capitalizeFirstLetter(string: string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
      <div
        className={`${styles.customInput} ${themeClass} ${
          focus ? styles.focused : styles.notFocused
        }
        ${error ? styles.error : styles.noError}`}
      >
        <div className={styles.customInput__labelContainer}>
          <label
            htmlFor={name}
            className={`${
              styles.customInput__labelContainer__label
            }  ${themeClass} ${focus ? styles.focused : styles.notFocused}`}
          >
            {capitalizeFirstLetter(name)}
          </label>
          {actionLabel && actionRoute && (
            <Link href={actionRoute}>{actionLabel}</Link>
          )}
        </div>
        <div className={styles.customInput__inputContainer}>
          {icon &&
            cloneElement(icon, {
              size: iconSize,
              className: `${
                styles.customInput__inputContainer__icon
              }  ${themeClass} ${focus ? styles.focused : styles.notFocused}`,
            })}
          <input
            className={styles.customInput__inputContainer__input}
            name={name}
            placeholder={placeholder}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            type={showPassword ? 'text' : type}
            ref={ref}
            {...props}
          />
          {isPasswordField &&
            (showPassword ? (
              <IoEyeOutline
                size={iconSize}
                className={`${
                  styles.customInput__inputContainer__icon
                } ${themeClass} ${focus ? styles.focused : styles.notFocused}`}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoEyeOffOutline
                size={iconSize}
                className={`${
                  styles.customInput__inputContainer__icon
                } ${themeClass} ${focus ? styles.focused : styles.notFocused}`}
                onClick={() => setShowPassword(true)}
              />
            ))}
        </div>
        {error && error.message && (
          <p className={styles.customInput__error}>
            {error.message.toString()}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
