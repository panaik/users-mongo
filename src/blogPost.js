const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// A Blog post will have many comments associated with it
const BlogPostSchema = new Schema({
  title: String,
  content: String,
  comments: [
    {
      // here we are not nesting documents
      // Rather we are passing a reference to another model or a document sitting inside a 'Comment' collection
      // So to indicate that we are going to pass a reference to a document in another collection,
      // we set a type of ObjectId, and a specific 'ref' of type 'Comment'
      // this 'ref' will be matched up by Mongoose against a 'Comment' model
      type: Schema.Types.ObjectId,
      ref: 'comment'
      // value of 'ref' must match with the name of the comment model as defined in comment.js
    }
  ]
});

const BlogPost = mongoose.model('blogPost', BlogPostSchema);

module.exports = BlogPost;
