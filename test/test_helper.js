const mongoose = require('mongoose');

// this to avoid using Mongoose's default mpromise implementation, which is deprecated
// Hence we will use ES6 Promise (global.Promise)
mongoose.Promise = global.Promise;

// 'users_test' is the database name
// 'users_test' will contain collections
// 'once' and 'on' : event handlers, 'once' means watch for mongoose to emit an event called 'open' one time
// and once it does run the provided arrow function

// before is only executed one time before executing our entire test suite
// so now all of our test will only run once our mongo connection has been successfully made
// hence we pass the 'done' callback, and execute it after open event, telling Mocha to run the next test
before(done => {
  mongoose.connect('mongodb://localhost/users_test', { useMongoClient: true });
  mongoose.connection
    .once('open', () => {
      done();
    })
    .on('error', error => {
      console.warn('Warning', error);
    });
});

// Adding a 'hook' here - hook is a function that will be executed before any test gets executed inside our test suite
// beforeEach hook runs before execution of every single test
beforeEach(done => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  // In mongo collection names are in lowercase

  // take all records inside 'users' and drop them by calling 'drop' function
  // Since drop is a long running function (takes some time),
  // we want to wait until it finishes to execute any tests further
  // 'drop' takes a callback which executes only after all users are dropped

  // same logic applies to comments & blogPosts collections as well
  // unfortunately we cannot drop multiple collections in mongo at a time, hence we have to do it sequentially
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        // Ready to run the next test!
        done(); // done is called so that Mocha can go and execute next test
      });
    });
  });
});
