/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    name: { type: String },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true, trim: true },
    like: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislike: [{ type: Schema.Types.ObjectId, ref: "User" }],

    articleId: { type: Schema.Types.ObjectId, ref: "Article" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(`Comment`, commentSchema);
