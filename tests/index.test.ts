import { Bot } from 'grammy';
import { Ymmarg } from '../src/index';

const bot = new Bot('yourTokenHere');
bot.botInfo = {
    id: Ymmarg.getId(),
    is_bot: true,
    username: 'testbot',
    first_name: 'testbot',
    can_join_groups: true,
    can_read_all_group_messages: true,
    supports_inline_queries: true,
};
bot.api.config.use(async (prev, method, payload, signal) => {
    // disable all calls to the api
    return undefined as any;
});

bot.chatType('group').on('chat_member', async (ctx) => {
    console.dir(ctx.chatMember);
});

const group1 = Ymmarg.createGroup();
const user1 = Ymmarg.createUser();

const addUserUpdate = group1.addUser(user1);

bot.handleUpdate(addUserUpdate);
