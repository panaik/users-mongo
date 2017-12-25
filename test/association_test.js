const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, blogPost, comment;

  // lets create some instances before we define our tests
  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yup it really is'
    });
    comment = new Comment({ content: 'Congrats on great post' });

    // Next setup all the relationships

    // associate blogPost to joe user
    joe.blogPosts.push(blogPost);

    // associate comment to the blogPost
    blogPost.comments.push(comment);

    // associate joe to a comment
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() =>
      done()
    );
  });

  // 'it.only' - Mocha will only run this test and no other tests will be executed
  // it.only('saves a relation between a user and a blogpost', done => {
  it('saves a relation between a user and a blogpost', done => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts') // blogPosts is the prop defined in the User model
      .then(user => {
        // console.log(user);
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      });
  });

  it('saves a full relation graph', done => {
    User.findOne({ name: 'Joe' })
      .populate({
        // in the found 'user', find the blogPosts property and attempt to load up all the associated blogposts
        path: 'blogPosts',
        populate: {
          // inside of the blogposts just fetched, find the comments property and attempt to load up all the associated comments
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then(user => {
        // console.log(user.blogPosts[0].comments[0]);
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(
          user.blogPosts[0].comments[0].content === 'Congrats on great post'
        );
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');

        done();
      });
  });
});
