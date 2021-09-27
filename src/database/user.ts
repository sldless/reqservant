import { model, Schema } from "mongoose";

interface User {
  id: string;
  cases: Array<Object>;
}

export const user = model(
  "users",
  new Schema<User>({
    id: String,
    cases: [{ type: Object }],
  })
);
