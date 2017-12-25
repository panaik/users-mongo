const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {
  it('can create a subdocument', done => {
    const joe = new User({
      name: 'Joe',
      posts: [{ title: 'PostTitle' }]
    });

    joe
      .save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user.posts[0].title === 'PostTitle');
        done();
      });
  });

  it('Can add subdocuments to an existing record', done => {
    const joe = new User({
      name: 'Joe',
      posts: []
    });
    joe
      .save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        user.posts.push({ title: 'New Post' });
        return user.save();
      })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user.posts[0].title === 'New Post');
        done();
      });
  });

  it('Can remove an existing subdocument', done => {
    const joe = new User({
      name: 'Joe',
      posts: [{ title: 'New Title' }]
    });
    joe
      .save()
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        const post = user.posts[0];
        post.remove();
        // remove function on a subdocument is from Mongoose, so we can use this instead of using Array.Slice
        // remove function on a subdocument does not save the changes to Mongo, unlike Model's remove function
        // hence we need to call save on user
        return user.save();
      })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user.posts.length === 0);
        done();
      });
  });
});
