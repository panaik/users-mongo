// In this file we will define our User Model
// model corresponds to a collection inside MongoDB
const mongoose = require('mongoose');
const PostSchema = require('./post');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
    required: [true, 'Name is required.']
  },
  // postCount: Number, // converting postCount to a Virtual type
  posts: [PostSchema], // PostSchema here becomes a subdocument, as we are nesting it inside UserSchema
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'blogPost'
      // value of 'ref' must match with the name of the BlogPost model as defined in blogPost.js
    }
  ]
});

// Defining virtual property/field of 'postCount'...virtual types are defined outside UserSchema definition
UserSchema.virtual('postCount').get(function() {
  // console.log('Hi!');
  // return this;
  return this.posts.length;
  // this returns the instance of the model we are working on
  // that is this.posts will give us joe.posts, all the posts associated to joe user instance
  // this is because we did not use a fat arrow function rather we use the function keyword to the get function
});

// Pre-Remove middleware - here we are trying to delete the blogPosts associated with a particular user
// when we are trying to remove the user from the collection,
// and want to make sure that we remove blogPosts before/pre user's deletion
// This Pre-Remove middleware will run before removal of any user record
UserSchema.pre('remove', function(next) {
  // this === model instance / joe user instance => joe = new User({})

  // first lets pull in blogPost model
  const BlogPost = mongoose.model('blogPost');

  // $in -> all through all the records in blogPost collection, look at their _ids,
  // if a id is 'in' this.blogPosts array, then remove those records
  BlogPost.remove({ _id: { $in: this.blogPosts } }).then(() => next());
  // we are complete/done here, call the next middleware if one exists or otherwise remove the record from the DB
});

const User = mongoose.model('user', UserSchema);
// so now Mongoose will create a collection 'user' if it doesn't exist inside Mongo
// so 'User' is a user class or user Model
// It does not represent any particular user in our app
// 'User' represents the entire collection of data sitting inside the database

module.exports = User;
