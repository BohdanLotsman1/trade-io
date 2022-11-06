export interface IToken {
  sub: string;
  access_verify: string;
  access_token: string;
  metadata: {
    user_id: string;
    fid?: string[];
  };
  iat: number;
  exp: number;
}
