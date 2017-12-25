const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
    // 'user' is the name of the User Model as defined in user.js
    // value of 'ref' must match with the name of the user model as defined in user.js
  }
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
