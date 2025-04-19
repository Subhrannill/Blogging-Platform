const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: {
      url: String,
      publicId: String,
      width: Number,
      height: Number,
      format: String,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const PostModel = model('Post', PostSchema);

module.exports = PostModel;
