const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: String
  // additional properties
  // content,
  // createdAt
});

module.exports = PostSchema;

// we are not going to create a Post Model, as post is not going to map to distinct collection of records in our DB
// rather post is just going to be a subdocument inside the User model
