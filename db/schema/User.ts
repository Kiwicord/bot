import mongoose, { Schema } from "mongoose";

export interface Item {
  name: string;
  description?: string;
  type: string;
  price: number;
}
interface User {
  discordId: string;
  balance: number;
  inventory: Item[];
}

const Item = new Schema<Item>({
  name: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  description: {
    type: mongoose.SchemaTypes.String,
    required: false,
    default: "",
  },
  type: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  price: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
});

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
  inventory: {
    type: [Item],
    default: [],
  },
});

export default mongoose.model("User", User);
