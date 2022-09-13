import { Chat, Update, User } from 'grammy/types.ts';
import { Bot } from 'grammy/mod.ts';

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

function createEnvironment(): EnvironmentWrapper {
  return new EnvironmentWrapper();
}

class EnvironmentWrapper {
  private counter = 0;

  private _chats: Map<number, ChatWrapper<Chat>> = new Map();
  private _users: Map<number, UserWrapper> = new Map();
  private _updates: Update[] = [];

  public getChat(id: number): ChatWrapper<Chat> | undefined {
    return this._chats.get(id);
  }

  public getUser(id: number): UserWrapper | undefined {
    return this._users.get(id);
  }

  private getId() {
    return ++counter;
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

  public setup(bot: Bot) {
    bot.api.config.use(async (prev, method, payload, abort) => {
      return undefined as any;
    });
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

  public addUser(userWrapper: UserWrapper): ChatMemberUpdate {
    if (this._participants[userWrapper.user.id] !== undefined) {
      throw new Error('User already added to chat');
    }
    if (this._environment.getUser(userWrapper.user.id) !== userWrapper) {
      throw new Error(
        'User is not part of this environment. Did you use the wrong user?'
      );
    }

    this._participants[userWrapper.user.id] = userWrapper.user;
    return {
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
  }
}

type UpdateType<T extends keyof Omit<Update, 'update_id'>> = Required<
  Pick<Update, 'update_id' | T>
>;

type MessageUpdate = UpdateType<'message'>;
type ChatMemberUpdate = UpdateType<'chat_member'>;

export const Ymmarg = {
  createEnvironment,
  getId,
};
