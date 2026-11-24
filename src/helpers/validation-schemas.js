import * as yup from 'yup';

const email = yup
  .string()
  .trim()
  .required('Email is required')
  .email('Enter a valid email');

const password = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters')
  .max(12, 'Password must be at most 12 characters');

// TASK-12: all fields required, valid email, 6-12 char password that matches.
export const registrationSchema = yup.object({
  username: yup.string().trim().required('Name is required'),
  email,
  password,
  confirmPassword: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

// TASK-20: all fields required, valid email, 6-12 char password.
export const loginSchema = yup.object({
  email,
  password,
});
