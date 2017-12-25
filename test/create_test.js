const assert = require('assert'); // this comes from Mocha
const User = require('../src/user');

describe('Creating records', () => {
  it('saves a user', done => {
    // 'done' is available to every single 'it' block

    // 1. Create a new user
    // here we use the User model to create an instance joe
    const joe = new User({ name: 'Joe' });

    // 2. Save instance joe of model User to database
    // here 'joe' has ton functions attached to it, one of them is 'save'
    joe.save().then(() => {
      // Has joe been saved successfully?
      // so if joe was successfully saved to mongo then isNew should be false
      // and will assert a 'truthy' value here to indicate test passed
      assert(!joe.isNew);
      done();
    });
  });
});

// sample test
// it('saves a user', () => {
//   // make an assertion here
//   assert(1 + 1 === 2);
// });
