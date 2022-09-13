import { Chat, Update, User } from "grammy/types.ts";

function getUnixTime() {
  return ~~(Date.now() / 1000);
}

let counter = 0;
function getId() {
  return counter++;
}

const dummyUser: User = {
  first_name: "Dummy",
  id: -1,
  is_bot: false,
};

function createGroup(): ChatWrapper<Chat.GroupChat> {
  const id = getId();

  const wrapper = new ChatWrapper<Chat.GroupChat>({
    id,
    title: `Group ${id}`,
    type: "group",
  });

  return wrapper;
}

class ChatWrapper<T extends Chat> {
  private _chat: T;
  public get chat(): T {
    return this._chat;
  }

  private _participants: {
    [id: number]: User;
  } = {};

  constructor(chat: T) {
    this._chat = chat;
  }

  public addUser(userWrapper: UserWrapper): ChatMemberUpdate {
    if (this._participants[userWrapper.user.id] !== undefined) {
      throw new Error("User already added to chat");
    }
    this._participants[userWrapper.user.id] = userWrapper.user;
    return {
      update_id: getId(),
      chat_member: {
        chat: this._chat,
        date: getUnixTime(),
        from: dummyUser,
        new_chat_member: {
          status: "member",
          user: userWrapper.user,
        },
        old_chat_member: {
          status: "left",
          user: userWrapper.user,
        },
      },
    };
  }
}

type MessageUpdate = Required<Pick<Update, "update_id" | "message">>;
type ChatMemberUpdate = Required<Pick<Update, "update_id" | "chat_member">>;

function createUser(): UserWrapper {
  const id = getId();

  return new UserWrapper({
    id,
    first_name: `User ${id}`,
    is_bot: false,
  });
}

class UserWrapper {
  private _user: User;
  public get user(): User {
    return this._user;
  }

  constructor(user: User) {
    this._user = user;
  }
}

export const Ymmarg = {
  createGroup,
  createUser,
  getId,
};
