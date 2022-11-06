import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as Base64 from 'crypto-js/enc-base64';
import * as Utf8 from 'crypto-js/enc-utf8';

const PASSWORD_SALT = '$^GHVHJV(*&HJBN';

export class HashService {
  static hash(secret: string): string {
    return bcrypt.hashSync(secret, 10);
  }

  static check(secret: string, hash: string): Promise<boolean> {
    hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');

    return bcrypt.compare(secret, hash);
  }

  static salt(password: string) {
    return `${PASSWORD_SALT}${password}${PASSWORD_SALT}${password}`;
  }

  static rand(size: number = 32) {
    return crypto.randomBytes(size).toString('hex');
  }

  static base64_encode(value: string) {
    return Base64.stringify(Utf8.parse(value));
  }
}
