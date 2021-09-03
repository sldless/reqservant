import { model, Schema } from "mongoose";

interface Suggestion {
  author: String;
  votes: Number;
  votedUsers: [{ type: Object }];
  type: String;
  id: String;
}

export const suggestion = model(
  "suggestions",
  new Schema<Suggestion>({
    author: String,
    votes: Number,
    votedUsers: [{ type: Object }],
    type: String,
    id: String,
  })
);
