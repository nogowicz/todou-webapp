import { object, string } from 'yup';

export const signInSchema = object({
  email: string().email('Email is not valid').required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one special character, and one digit'
    )
    .required('Password is required'),
}).required();
