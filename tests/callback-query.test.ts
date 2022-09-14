import { assertEquals, assertExists } from 'std/testing/asserts.ts';
import { CallbackQuery } from '../callback-query.ts';
import { Message } from '../message.ts';
import { User } from '../user.ts';

Deno.test('CallbackQuery', async (t) => {
  await t.step('defaults', () => {
    const callbackQuery = new CallbackQuery().build();

    assertExists(callbackQuery.id);
    assertExists(callbackQuery.from);
    assertExists(callbackQuery.message);
    assertEquals(callbackQuery.chat_instance, '');
    assertEquals(callbackQuery.data, undefined);
    assertEquals(callbackQuery.game_short_name, undefined);
    assertEquals(callbackQuery.inline_message_id, undefined);
  });

  await t.step('from()', () => {
    const user = new User().id(1);
    const callbackQuery = new CallbackQuery().from(user).build();

    assertEquals(callbackQuery.from, user.build());
  });

  await t.step('chatInstance()', () => {
    const callbackQuery = new CallbackQuery().chatInstance('test_instance').build();

    assertEquals(callbackQuery.chat_instance, 'test_instance');
  });

  await t.step('id()', () => {
    const callbackQuery = new CallbackQuery().id('test_id').build();

    assertEquals(callbackQuery.id, 'test_id');
  });

  await t.step('data()', () => {
    const callbackQuery = new CallbackQuery().data('test_data').build();

    assertEquals(callbackQuery.data, 'test_data');
  });

  await t.step('gameShortName()', () => {
    const callbackQuery = new CallbackQuery().gameShortName('test_short_name').build();

    assertEquals(callbackQuery.game_short_name, 'test_short_name');
  });

  await t.step('inlineMessageId()', () => {
    const callbackQuery = new CallbackQuery().inlineMessageId('test_id').build();

    assertEquals(callbackQuery.inline_message_id, 'test_id');
  });

  await t.step('message()', () => {
    const callbackQuery = new CallbackQuery().message(new Message()).build();

    assertExists(callbackQuery.message);
  });
});
