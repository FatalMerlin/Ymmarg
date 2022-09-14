import {
  CallbackQuery as GrammyCallbackQuery,
  Message as GrammyMessage,
  User as GrammyUser,
} from 'grammy/types.ts';
import { Message } from './message.ts';
import { User } from './user.ts';

export class CallbackQuery {
  private _from?: GrammyUser | User;
  private _message?: GrammyMessage | Message;
  private _chatInstance = '';
  private _id = '';
  private _data: string | undefined;
  private _gameShortName: string | undefined;
  private _inlineMessageId: string | undefined;

  private getFrom() {
    if (!this._from) {
      return new User().build();
    }
    return this._from instanceof User ? this._from.build() : this._from;
  }

  private getMessage() {
    if (!this._message) {
      return new Message().build();
    }
    return this._message instanceof Message ? this._message.build() : this._message;
  }

  public build(): GrammyCallbackQuery {
    return {
      from: this.getFrom(),
      chat_instance: this._chatInstance,
      id: this._id,
      data: this._data,
      game_short_name: this._gameShortName,
      inline_message_id: this._inlineMessageId,
      message: this.getMessage(),
    };
  }

  public from(from: User | GrammyUser) {
    this._from = from;
    return this;
  }

  public chatInstance(chatInstance: string) {
    this._chatInstance = chatInstance;
    return this;
  }

  public id(id: string) {
    this._id = id;
    return this;
  }

  public data(data: string) {
    this._data = data;
    return this;
  }

  public gameShortName(gameShortName: string) {
    this._gameShortName = gameShortName;
    return this;
  }

  public inlineMessageId(inlineMessageId: string) {
    this._inlineMessageId = inlineMessageId;
    return this;
  }

  public message(message: Message | GrammyMessage) {
    this._message = message;
    return this;
  }
}
