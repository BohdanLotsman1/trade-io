import * as yup from "yup";
import { UserModel } from "../../../modules/user/models/user.model";

export const registerSchema = yup.object({
    name: yup.string()
        .required( 'Nname is required' )
        .max( 50, 'First name should be no more than 50 characters long' ),

    email: yup.string()
        .required('Email is required')
        .max(50, 'Email should be no more than 50 characters long')
        .test( 'exists', 'Email already exists',
            async (value) => void 0 === value || (await UserModel.query().where('email',value)).length === 0 ),


    password: yup.string()
        .required('No password provided.')
        .min(8, 'Password is too short - should be 8 chars minimum.'),

    password_confirmation: yup.string()
        .required('No confirm password provided.')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});