import { Events, MessageReaction, User } from "discord.js";
import ReactionRole from "../db/schema/ReactionRole.js";

export default {
  event: Events.MessageReactionAdd,
  once: false,
  callback: async (reaction: MessageReaction, reactionUser: User) => {
    const reactionRoles = await ReactionRole.find({
      messageId: reaction.message.id,
    });

    if (!reactionRoles) return;

    const reactionRole = reactionRoles.find(
      (rr) => rr.emoji === reaction.emoji.toString()
    );

    if (!reactionRole) return;

    const role = await reaction.message.guild?.roles.fetch(
      reactionRole?.roleId
    );

    if (!role) return;

    const user = await reaction.message.guild?.members.fetch(reactionUser.id);

    if (!user) return;

    await user.roles.add(role);
  },
} as IEvent;
