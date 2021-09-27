import { model, Schema } from "mongoose";

interface Suggestion {
  author: string;
  type: string;
  id: string;
  image: string;
  message: string;
  content: string;
  status: string;
}

export const suggestion = model(
  "suggestions",
  new Schema<Suggestion>({
    author: { required: true, type: String },
    type: { required: true, type: String },
    id: { required: true, type: String },
    content: { required: true, type: String },
    status: String,
    image: String,
    message: String,
  })
);
