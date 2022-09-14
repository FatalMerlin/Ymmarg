import { User as GrammyUser } from 'grammy/types.ts';
import { generateId } from './id.ts';

export class User {
  private _id: number | undefined;
  private _first_name: string | undefined;
  private _is_bot = false;
  private _added_to_attachment_menu = false;
  private _is_premium = false;
  private _language_code = 'en';
  private _last_name: string | undefined;
  private _username: string | undefined;

  public build(): GrammyUser {
    const id = this._id ?? generateId();

    return {
      id,
      first_name: this._first_name ?? `User ${id}`,
      is_bot: this._is_bot,
      ...(this._added_to_attachment_menu ? { added_to_attachment_menu: true } : {}),
      ...(this._is_premium ? { is_premium: true } : {}),
      language_code: this._language_code,
      last_name: this._last_name,
      username: this._username,
    };
  }

  public id(id: number) {
    this._id = id;
    return this;
  }

  public name(firstName: string, lastName?: string) {
    this._first_name = firstName;
    if (lastName) {
      this._last_name = lastName;
    }
    return this;
  }

  public bot() {
    this._is_bot = true;
    return this;
  }

  public addToAttachmentMenu() {
    this._added_to_attachment_menu = true;
    return this;
  }

  public premium() {
    this._is_premium = true;
    return this;
  }

  public language(language: string) {
    this._language_code = language;
    return this;
  }

  public username(username: string) {
    this._username = username;
    return this;
  }
}
