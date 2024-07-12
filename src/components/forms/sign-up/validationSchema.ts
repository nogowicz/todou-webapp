import { object, string, ref } from 'yup';

const nameRegex =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

export const getSignUpSchema = (t: Function) =>
  object({
    firstName: string()
      .max(25, t('first-name-too-long'))
      .matches(nameRegex, t('first-name-invalid'))
      .required(t('first-name-required')),
    lastName: string()
      .max(25, t('last-name-too-long'))
      .matches(nameRegex, t('last-name-invalid'))
      .required(t('last-name-required')),
    email: string().email(t('email-invalid')).required(t('email-required')),
    password: string()
      .min(6, t('password-min'))
      .required(t('password-required')),
    confirmPassword: string()
      .min(6, t('confirm-password-min'))
      .oneOf([ref('password')], t('password-match'))
      .required(t('confirm-password-required')),
  }).required();
