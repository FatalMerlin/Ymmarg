import { assertEquals, assertExists } from 'std/testing/asserts.ts';
import { User } from '../src/user.ts';

Deno.test('User', async (t) => {
  await t.step('defaults', () => {
    const user = new User().build();

    assertExists(user.id);
    assertEquals(user.first_name, `User ${user.id}`);
    assertEquals(user.is_bot, false);
    assertEquals(user.added_to_attachment_menu, undefined);
    assertEquals(user.is_premium, undefined);
    assertEquals(user.language_code, 'en');
    assertEquals(user.last_name, undefined);
    assertEquals(user.username, undefined);
  });

  await t.step('id()', () => {
    const user = new User().id(1).build();

    assertEquals(user.id, 1);
  });

  await t.step('name()', () => {
    const user = new User().name('first', 'last').build();

    assertEquals(user.first_name, 'first');
    assertEquals(user.last_name, 'last');
  });

  await t.step('bot()', () => {
    const user = new User().bot().build();

    assertEquals(user.is_bot, true);
  });

  await t.step('addToAttachmentMenu()', () => {
    const user = new User().addToAttachmentMenu().build();

    assertEquals(user.added_to_attachment_menu, true);
  });

  await t.step('premium()', () => {
    const user = new User().premium().build();

    assertEquals(user.is_premium, true);
  });

  await t.step('language()', () => {
    const user = new User().language('pt').build();

    assertEquals(user.language_code, 'pt');
  });

  await t.step('username()', () => {
    const user = new User().username('test_username').build();

    assertEquals(user.username, 'test_username');
  });
});
