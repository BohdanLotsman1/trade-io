import * as bcrypt from 'bcrypt';

export class HashService {
  static hash(secret: string): string {
    return bcrypt.hashSync(secret, 10);
  }
}
