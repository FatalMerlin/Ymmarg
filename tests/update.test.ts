import { assert } from 'https://deno.land/std@0.150.0/_util/assert.ts';
import { Ymmarg } from '../src/index.ts';

Deno.test('Update Builder', async (t) => {
  await t.step('CallbackQuery Update Builder', () => {
    const update = new Ymmarg.Update().id(7).callbackQuery().build();

    assert(typeof update.update_id === 'number');
    assert(update.update_id === 7);
    console.dir(update.callback_query);
  });
});
