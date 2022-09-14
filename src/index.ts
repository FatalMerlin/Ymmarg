import { Methods, Payload } from 'grammy/core/client.ts';
import { Bot, RawApi } from 'grammy/mod.ts';
import { ApiResponse, Chat, User } from 'grammy/types.ts';
import { assertExists, assertStrictEquals } from 'std/testing/asserts.ts';
import { UpdateBuilder } from './builders/update.ts';
import { ChatMemberUpdate } from './types/update.ts';

function getUnixTime() {
  return ~~(Date.now() / 1000);
}

let counter = 0;
function getId() {
  return ++counter;
}

const dummyUser: User = {
  first_name: 'Dummy',
  id: -1,
  is_bot: false,
};

function createEnvironment(bot: Bot): EnvironmentWrapper {
  return new EnvironmentWrapper(bot);
}

type ApiEvent = {
  method: Methods<RawApi>;
  payload: Payload<Methods<RawApi>, RawApi>;
};

type Awaited<T> = T extends PromiseLike<infer V> ? V : T;

type ApiCallResult<M extends Methods<R>, R extends RawApi> = R[M] extends (
  ...args: unknown[]
) => unknown
  ? Awaited<ReturnType<R[M]>>
  : never;

class EnvironmentWrapper {
  private _counter = 0;

  private _chats: Map<number, ChatWrapper<Chat>> = new Map();
  private _users: Map<number, UserWrapper> = new Map();
  private _events: ApiEvent[] = [];

  constructor(private _bot: Bot) {
    this.setup(_bot);
  }

  public getChat(id: number): ChatWrapper<Chat> | undefined {
    return this._chats.get(id);
  }

  public getUser(id: number): UserWrapper | undefined {
    return this._users.get(id);
  }

  public getEvents() {
    const events = this._events;
    this._events = [];
    return events;
  }

  public get bot() {
    return this._bot;
  }

  private getId() {
    return ++this._counter;
  }

  public createGroup(): ChatWrapper<Chat.GroupChat> {
    const id = this.getId();

    const chatWrapper = new ChatWrapper<Chat.GroupChat>(this, {
      id,
      title: `Group ${id}`,
      type: 'group',
    });

    this._chats.set(id, chatWrapper);
    return chatWrapper;
  }

  public createUser(): UserWrapper {
    const id = getId();

    const userWrapper = new UserWrapper(this, {
      id,
      first_name: `User ${id}`,
      is_bot: false,
    });

    this._users.set(id, userWrapper);
    return userWrapper;
  }

  private setup(bot: Bot) {
    bot.api.config.use(
      // deno-lint-ignore require-await
      async (
        _prev,
        method,
        payload
      ): Promise<ApiResponse<ApiCallResult<Methods<RawApi>, RawApi>>> => {
        this._events.push({ method, payload });

        switch (method) {
          case 'sendMessage':
            return {
              ok: true,
            } as ApiResponse<ApiCallResult<'sendMessage', RawApi>>;
        }
        // deno-lint-ignore no-explicit-any
        return undefined as any;
      }
    );
  }
}

class UserWrapper {
  private _user: User;
  public get user(): User {
    return this._user;
  }

  constructor(private _environment: EnvironmentWrapper, user: User) {
    this._user = user;
  }
}

class ChatWrapper<T extends Chat> {
  private _chat: T;
  public get chat(): T {
    return this._chat;
  }

  private _participants: {
    [id: number]: User;
  } = {};

  constructor(private _environment: EnvironmentWrapper, chat: T) {
    this._chat = chat;
  }

  public async addUser(userWrapper: UserWrapper): Promise<ApiEvent[]> {
    if (this._participants[userWrapper.user.id] !== undefined) {
      throw new Error('User already added to chat');
    }
    if (this._environment.getUser(userWrapper.user.id) !== userWrapper) {
      throw new Error(
        'User is not part of this environment. Did you use the wrong user?'
      );
    }

    this._participants[userWrapper.user.id] = userWrapper.user;

    const update: ChatMemberUpdate = {
      update_id: getId(),
      chat_member: {
        chat: this._chat,
        date: getUnixTime(),
        from: dummyUser,
        new_chat_member: {
          status: 'member',
          user: userWrapper.user,
        },
        old_chat_member: {
          status: 'left',
          user: userWrapper.user,
        },
      },
    };

    await this._environment.bot.handleUpdate(update);

    return this._environment.getEvents();
  }
}

export const Ymmarg = {
  Update: UpdateBuilder,
  createEnvironment,
  getId,
  expect(event: ApiEvent) {
    return {
      to: {
        replyWith(message: string) {
          assertStrictEquals(event.method, 'sendMessage');
          const payload = event.payload as Payload<'sendMessage', RawApi>;
          assertExists(payload.text);

          assertStrictEquals(payload.text, message);

          return {
            inChat(chat: number | Chat | ChatWrapper<Chat>) {
              const chatId =
                typeof chat === 'number'
                  ? chat
                  : chat instanceof ChatWrapper
                  ? chat.chat.id
                  : chat.id;
              assertStrictEquals(payload.chat_id, chatId);
            },
          };
        },
      },
    };
  },
};
