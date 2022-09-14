import { CallbackQuery as GrammyCallbackQuery, Update as GrammyUpdate } from 'grammy/types.ts';
import { CallbackQuery } from './callback-query.ts';
import { generateId } from './id.ts';

// TODO: add logic to return the rest of the update types
export class Update {
  private _id?: number;
  private _callbackQuery?: CallbackQuery | GrammyCallbackQuery;

  private getCallbackQuery() {
    if (!this._callbackQuery) return undefined;
    return this._callbackQuery instanceof CallbackQuery
      ? this._callbackQuery.build()
      : this._callbackQuery;
  }

  public build(): GrammyUpdate {
    const id = this._id ?? generateId();

    return {
      update_id: id,
      callback_query: this.getCallbackQuery(),
    };
  }

  public callbackQuery(
    cq?: CallbackQuery | GrammyCallbackQuery,
  ): { update_id: number; callback_query: GrammyCallbackQuery } {
    this._callbackQuery = cq || new CallbackQuery().build();
    // TODO: ugly pls help with fix?
    return this.build() as any;
  }
}
