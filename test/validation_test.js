const assert = require('assert');
const User = require('../src/user');

describe('Validating records', () => {
  it('requires a user name', () => {
    const user = new User({ name: undefined });
    // we don't need to save this user model instance to DB, as we are trying to just validate it
    // now we will try to validate this model instance
    // 'validateSync' is synchronous whereas 'validate' isn't
    // validateSync will return the result instantly
    const validationResult = user.validateSync();
    // console.log(validationResult);
    const { message } = validationResult.errors.name;
    assert(message === 'Name is required.'); // 'Name is required.' is the message expected as per the User model definition in user.js
  });

  it("requires a user's name longer than 2 characters", () => {
    const user = new User({ name: 'Al' });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === 'Name must be longer than 2 characters.');
  });

  // attempt to save an invalid record should result in an error, that is the save promise is rejected and the catch block runs
  it('disallows invalid records from being saved', done => {
    const user = new User({ name: 'Al' });
    user.save().catch(validationResult => {
      const { message } = validationResult.errors.name;

      assert(message === 'Name must be longer than 2 characters.');
      done();
    });
  });
});
