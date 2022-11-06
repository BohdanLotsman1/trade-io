import { Injectable } from '@nestjs/common';
import { Model } from 'nestjs-objection';
import { UlidModel } from 'src/lib/models/ulidModel';
import _ from 'underscore';

@Injectable()
export class UserModel extends UlidModel {
  static get tableName() {
    return 'user';
  }

  email: string;
  name: string;
  password: string;

  get $secureFields(): string[] {
    return ['password'];
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    return _.omit(json, this.$secureFields);
  }
}
