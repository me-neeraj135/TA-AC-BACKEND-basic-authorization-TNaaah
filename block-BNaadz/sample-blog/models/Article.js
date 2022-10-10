/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    like: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislike: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    slug: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model(`Article`, articleSchema);
