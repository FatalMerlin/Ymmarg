import { Bot } from 'grammy/mod.ts';
import {
  Payload,
  RawApi,
} from 'https://deno.land/x/grammy@v1.10.1/core/client.ts';
import { assertEquals, assertExists } from 'std/testing/asserts.ts';
import { Ymmarg } from '../src/index.ts';

Deno.test('ctx.chatMember', async () => {
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

  bot.chatType('group').on('chat_member', async (ctx) => {
    assertExists(ctx.chatMember);
    assertExists(ctx.chatMember.chat);
    assertExists(ctx.chatMember.from);
    assertExists(ctx.chatMember.date);

    await ctx.reply('I got a new chatmember!');
  });

  const environment = Ymmarg.createEnvironment(bot);

  const group1 = environment.createGroup();
  const user1 = environment.createUser();

  // calls bot with resulting update
  const apiEvents = await group1.addUser(user1);

  assertEquals(apiEvents.length, 1);
  assertEquals(apiEvents[0].method, 'sendMessage');
  assertEquals(apiEvents[0].payload, {
    chat_id: group1.chat.id,
    text: 'I got a new chatmember!',
  } as Payload<'sendMessage', RawApi>);
});
