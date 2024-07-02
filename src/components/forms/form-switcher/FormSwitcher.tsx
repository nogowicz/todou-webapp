'use client';
import React, { useState } from 'react';
import SignUpForm from '../sign-up/SignUpForm';
import SignInForm from '../sign-in/SignInForm';
import ForgetPassword from '../forget-password/ForgetPassword';

export enum FormType {
  'sign-in',
  'sign-up',
  'forgot-password',
}

export default function FormSwitcher() {
  const [currentForm, setCurrentForm] = useState<FormType>(FormType['sign-in']);
  if (currentForm === FormType['sign-up'])
    return <SignUpForm setCurrentForm={setCurrentForm} />;

  if (currentForm === FormType['forgot-password'])
    return <ForgetPassword setCurrentForm={setCurrentForm} />;

  return <SignInForm setCurrentForm={setCurrentForm} />;
}
