import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string().email().required('Email required.'),
    password: yup.string().required('No password provided.'),
});