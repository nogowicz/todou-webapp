import { object, string } from 'yup';

export const getSignInSchema = (t: Function) =>
  object({
    email: string().email(t('email-invalid')).required(t('email-required')),
    password: string()
      .min(8, t('password-min'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        t('password-pattern')
      )
      .required(t('password-required')),
  }).required();
