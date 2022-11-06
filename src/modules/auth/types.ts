export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IPasswordChange {
  old_password: string;
  password: string;
  password_confirmation: string;
}
