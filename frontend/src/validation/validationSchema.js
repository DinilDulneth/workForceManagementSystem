import * as Yup from 'yup';

export const ValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
    .test('no-leading-space', 'Name cannot start with a space', 
      value => !value || !value.startsWith(' '))
    .test('no-trailing-space', 'Name cannot end with a space', 
      value => !value || !value.endsWith(' '))
    .test('no-consecutive-spaces', 'Name cannot contain consecutive spaces',
      value => !value || !value.includes('  '))
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .required('Password is required'),
  department: Yup.string()
    .matches(/^[A-Za-z\s]+$/, 'Department can only contain letters and spaces')
    .required('Department is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .nullable(),
  dateOfJoining: Yup.date()
    .min(new Date(), 'Date of joining cannot be in the past')
    .test('future-date', 'Date must be at least one day in the future', 
      value => {
        if (!value) return true;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return value >= tomorrow;
      })
      .test('not-too-far', 'Date cannot be more than 1 year in the future',
        value => {
          if (!value) return true;
          const oneYearFromNow = new Date();
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
          return value <= oneYearFromNow;
        })
      .required('Date of joining is required')
  });