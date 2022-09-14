import { CallbackQuery as GrammyCallbackQuery, Update } from 'grammy/types.ts';
import { CallbackQuery } from './callback-query.ts';
import { generateId } from './id.ts';
import { CallbackQueryUpdate } from './types/update.ts';

// TODO: add logic to return the rest of the update types
class UpdateBuilder {
  private update: Update = {
    update_id: -1,
  };

  public id(update_id: number): UpdateBuilder {
    this.update.update_id = update_id;
    return this;
  }

  private _id?: number;
  private _callbackQuery?: CallbackQuery | GrammyCallbackQuery;

  private getCallbackQuery() {
    if (!this._callbackQuery) return undefined;
    return this._callbackQuery instanceof CallbackQuery
      ? this._callbackQuery.build()
      : this._callbackQuery;
  }

  public build(): CallbackQueryUpdate {
    const id = this._id ?? generateId();

    return {
      update_id: id,
      callback_query: this.getCallbackQuery() || new CallbackQuery().build(),
    };
  }

  public callbackQuery(
    cq?: CallbackQuery | GrammyCallbackQuery
  ): CallbackQueryUpdate {
    this._callbackQuery = cq || new CallbackQuery().build();
    // TODO: ugly pls help with fix?
    return this.build();
  }
}

export { UpdateBuilder as Update };
