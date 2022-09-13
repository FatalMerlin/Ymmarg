import { Bot } from "grammy/mod.ts";
import { assertExists } from "std/testing/asserts.ts";
import { Ymmarg } from "../src/index.ts";

Deno.test("ctx.chatMember", async () => {
  const bot = new Bot("yourTokenHere");
  bot.botInfo = {
    id: Ymmarg.getId(),
    is_bot: true,
    username: "testbot",
    first_name: "testbot",
    can_join_groups: true,
    can_read_all_group_messages: true,
    supports_inline_queries: true,
  };

  // deno-lint-ignore no-explicit-any
  bot.api.config.use(() => Promise.resolve(undefined as any));

  bot.chatType("group").on("chat_member", (ctx) => {
    assertExists(ctx.chatMember);
    assertExists(ctx.chatMember.chat);
    assertExists(ctx.chatMember.from);
    assertExists(ctx.chatMember.date);
  });

  const group1 = Ymmarg.createGroup();
  const user1 = Ymmarg.createUser();

  const addUserUpdate = group1.addUser(user1);

  await bot.handleUpdate(addUserUpdate);
});
