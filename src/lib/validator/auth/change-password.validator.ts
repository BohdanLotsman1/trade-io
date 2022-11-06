import * as yup from "yup";

export const changePasswordSchema = yup.object({
    password: yup.string()
        .required('New password provided.')
        .min(8, 'Password is too short - should be 8 chars minimum.'),

    password_confirmation: yup.string()
        .required('No confirm password provided.')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),

    old_password: yup.string()
        .required('No password provided.')
});