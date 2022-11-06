import { SoftDeleteModel } from 'nestjs-objection';
import * as Objection from 'objection';

export class UlidModel extends SoftDeleteModel {
  static softDelete = 'deleted_at';

  $beforeInsert(queryContext: Objection.QueryContext): Promise<any> | void {
    this.id = require('ulid').ulid();
    this.created_at = new Date();
    this.updated_at = new Date();

    return super.$beforeInsert(queryContext);
  }

  $beforeUpdate(
    opt: Objection.ModelOptions,
    queryContext: Objection.QueryContext,
  ): Promise<any> | void {
    delete this.id;
    this.updated_at = new Date();

    return super.$beforeUpdate(opt, queryContext);
  }

  id: string;
  created_at: object;
  updated_at: object;
  deleted_at: object | null;
}
