import * as yup from 'yup';

export const UserYupSchema = yup.object({
    email: yup.string().max(100).required(),
    password: yup.string().min(8).required(),
    name: yup.string().max(50).required(),
});