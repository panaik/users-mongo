const assert = require('assert');
const User = require('../src/user');

describe('Deleting a user', () => {
  let joe;

  beforeEach(done => {
    joe = new User({ name: 'Joe' });
    joe.save().then(() => done());
  });

  // Four ways to remove records in Mongo and Mongoose
  // model instance remove
  // class method remove
  // class method findAndRemove
  // class method findByIdAndRemove

  it('model instance remove', done => {
    // using 'user' instance 'joe' created above to remove record
    joe
      .remove()
      // first we removed joe, then now we go back to the DB check if any Joe exists
      .then(() => User.findOne({ name: 'Joe' }))
      // so if joe was removed, then the second promise 'then' of findOne should return null as user to this second 'then' block
      .then(user => {
        assert(user === null);
        done();
      });
  });

  it('class method remove', done => {
    // using 'class' to remove records
    // Remove a bunch of records with some given criteria
    User.remove({ name: 'Joe' })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user === null);
        done();
      });
  });

  it('class method findOneAndRemove', done => {
    User.findOneAndRemove({ name: 'Joe' })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user === null);
        done();
      });
  });

  it('class method findByIdAndRemove', done => {
    User.findByIdAndRemove(joe._id)
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user === null);
        done();
      });
  });
});
