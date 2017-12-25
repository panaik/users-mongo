const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middleware', () => {
  let joe, blogPost;

  // lets create some instances before we define our tests
  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yup it really is'
    });

    // Next setup all the relationships

    // associate blogPost to joe user
    joe.blogPosts.push(blogPost);

    Promise.all([joe.save(), blogPost.save()]).then(() => done());
  });

  // so now we delete the user joe from User collection,
  // due to pre-remove middleware for User model, the blogposts associated with joe will also be removed
  // so we can assert that after joe's removal, there will be no or zero blogposts in the BlogPost collection
  it('users clean up dangling blogposts on remove', done => {
    joe
      .remove()
      .then(() => BlogPost.count()) //BlogPost.count returns number of records in BlogPost collection
      .then(count => {
        assert(count === 0);
        done();
      });
  });
});
