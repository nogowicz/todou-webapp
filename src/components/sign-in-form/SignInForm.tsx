import React from 'react';
import CustomInput from '../custom-input/CustomInput';
import { FiMail } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';

export default function SignInForm() {
  return (
    <form>
      <CustomInput
        name="Email"
        placeholder="johndoe@todou.com"
        icon={<FiMail />}
        type="email"
      />
      <CustomInput
        name="Password"
        placeholder="********"
        icon={<IoKeyOutline />}
        type="password"
        isPasswordField
        actionLabel="Forgot Password?"
        actionRoute="/forgot-password"
      />
    </form>
  );
}
