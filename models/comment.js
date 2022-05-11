const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

module.exports = model('Comment', commentSchema);
