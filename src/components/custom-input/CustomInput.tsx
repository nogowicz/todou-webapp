'use client';

import React, { cloneElement, forwardRef, useState } from 'react';
import { useMountedTheme } from '@/hooks/useMountedTheme';
import styles from './custom-input.module.scss';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import Link from 'next/link';

interface ICustomInput {
  label: string;
  placeholder?: string;
  icon?: JSX.Element;
  type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  isPasswordField?: boolean;
  error?:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<Record<string, unknown>>>
    | undefined;
  action?: Function;
  actionLabel?: string;
  [key: string]: any;
}

const iconSize = 30;

const CustomInput = forwardRef<HTMLInputElement, ICustomInput>(
  (
    {
      label,
      placeholder,
      icon,
      type,
      isPasswordField = false,
      error,
      action,
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

    return (
      <div
        className={`${styles.customInput} ${themeClass} ${
          focus ? styles.focused : styles.notFocused
        }
        ${error ? styles.error : styles.noError}`}
      >
        <div className={styles.customInput__labelContainer}>
          <label
            className={`${
              styles.customInput__labelContainer__label
            }  ${themeClass} ${focus ? styles.focused : styles.notFocused}`}
          >
            {label}
          </label>
          {actionLabel && action && (
            <p onClick={() => action()}>{actionLabel}</p>
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
            placeholder={placeholder}
            type={showPassword ? 'text' : type}
            ref={ref}
            {...props}
            onFocus={() => setFocus(true)}
            onBlur={() => {
              setFocus(false);
            }}
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
