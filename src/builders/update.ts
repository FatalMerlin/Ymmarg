import { CallbackQuery as GrammyCallbackQuery } from 'grammy/platform.deno.ts';
import { CallbackQuery } from '../callback-query.ts';
import { generateId } from '../id.ts';
import { BaseUpdate, CallbackQueryUpdate } from '../types/update.ts';

abstract class Builder<T> {
  public abstract build(): T;
}

type BuilderUtil<T> = {
  // [P in keyof T]: T[P] extends Record<string, unknown>
  //   ? () => T[P] | BuilderUtil<T[P]>
  //   : T[P];
  [P in keyof T]: ((arg0: T[P]) => BuilderUtil<T>) | (() => BuilderUtil<T[P]>);
} & {
  build(): T;
};

/**
 * Builder interface for grammY updates.
 */
export class UpdateBuilder extends Builder<BaseUpdate> {
  private _update: BaseUpdate = {
    update_id: NaN,
  };

  public build(): BaseUpdate {
    if (isNaN(this._update.update_id)) {
      this._update.update_id = generateId();
    }

    return this._update;
  }

  /**
   * Set the id for the update.
   */
  public id(id: number) {
    this._update.update_id = id;
    return this;
  }

  public get callbackQuery() {
    return new CallbackQueryUpdateBuilder(this.build());
  }
}

class CallbackQueryUpdateBuilder extends DependantBuilder<
  BaseUpdate,
  CallbackQueryUpdate
> {
  private _callbackQuery?: GrammyCallbackQuery;

  public build(): CallbackQueryUpdate {
    const result: CallbackQueryUpdate = {
      ...this.input,
      callback_query: this._callbackQuery || new CallbackQuery().build(),
    };

    return result;
  }
}
