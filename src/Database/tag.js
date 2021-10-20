const { model, Schema } = require("mongoose")

const document = new model("tags", new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  author: String,
  uses: Number,
  created: String,
}))

module.exports = document