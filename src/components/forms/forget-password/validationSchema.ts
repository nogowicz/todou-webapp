import { object, string } from 'yup';

export const forgetPasswordSchema = object({
  email: string().email('Email is not valid').required('Email is required'),
}).required();
