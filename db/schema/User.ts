import mongoose, { Schema } from "mongoose";

interface User {
  discordId: string;
  balance: number;
}

const User = new Schema<User>({
  discordId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  balance: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
});

export default mongoose.model("User", User);
