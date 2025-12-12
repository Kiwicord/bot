import mongoose, { Schema } from "mongoose";

interface ReactionRole {
  roleId: string;
  messageId: string;
  emoji: string;
  channelId: string;
}

const ReactionRole = new Schema<ReactionRole>({
  roleId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  messageId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  emoji: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  channelId: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

export default mongoose.model("ReactionRole", ReactionRole);
