const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  category: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  username: { type: String, required: true },
  imagePath: { type: String, required: true },
  voteScore: { type: Number }
}, { timestamps: true });

module.exports = model('Post', postSchema);
