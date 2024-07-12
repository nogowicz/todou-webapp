import { object, string } from 'yup';

export const getForgetPasswordSchema = (t: Function) =>
  object({
    email: string().email(t('email-invalid')).required(t('email-required')),
  }).required();
