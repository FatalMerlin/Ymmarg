import { Update } from 'grammy/types.ts';

export type BaseUpdate = Pick<Update, 'update_id'>;

export type UpdateTypeSelector = keyof Omit<Update, 'update_id'>;
export type UpdateTypeProperty<T extends UpdateTypeSelector> =
  Update[T] extends number ? never : Update[T];

export type UpdateType<T extends UpdateTypeSelector> = BaseUpdate &
  Required<Pick<Update, T>>;

export type CallbackQueryUpdate = UpdateType<'callback_query'>;
export type ChannelPostUpdate = UpdateType<'channel_post'>;
export type ChatJoinRequestUpdate = UpdateType<'chat_join_request'>;
export type ChatMemberUpdate = UpdateType<'chat_member'>;
export type ChosenInlineResultUpdate = UpdateType<'chosen_inline_result'>;
export type EditedChannelPostUpdate = UpdateType<'edited_channel_post'>;
export type EditedMessageUpdate = UpdateType<'edited_message'>;
export type InlineQueryUpdate = UpdateType<'inline_query'>;
export type MessageUpdate = UpdateType<'message'>;
export type MyChatMemberUpdate = UpdateType<'my_chat_member'>;
export type PollUpdate = UpdateType<'poll'>;
export type PollAnswerUpdate = UpdateType<'poll_answer'>;
export type PreCheckoutQueryUpdate = UpdateType<'pre_checkout_query'>;
export type ShippingQueryUpdate = UpdateType<'shipping_query'>;
