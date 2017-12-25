const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
  let joe;

  beforeEach(done => {
    // joe = new User({ name: 'Joe', postCount: 0 });
    joe = new User({ name: 'Joe', likes: 0 });
    joe.save().then(() => done());
  });

  // helper function
  function assertName(operation, done) {
    // find({}) - passing empty object to find, i.e, passing no selection criteria returns all the objects in our DB
    // so here we will grab all the records from the DB (expect only one record) without passing any criteria,
    // and that record's name must be 'Alex'

    operation.then(() => User.find({})).then(users => {
      assert(users.length === 1);
      assert(users[0].name === 'Alex');
      done();
    });
  }

  // Five ways to updating records in Mongo and Mongoose
  // model instance update using set and save
  // model instance update method
  // class method update
  // class method findOneAndUpdate
  // class method findByIdAndUpdate

  // before adding the helper function assertName
  // it('instance type using set and save', done => {
  //   // We will update 'joe' name from 'Joe' to 'Alex'
  //   // This approach is better for updating more than one property of an user instance
  //   joe.set('name', 'Alex');
  //   joe
  //     .save()
  //     // find({}) - passing empty object to find, i.e, passing no selection criteria returns all the objects in our DB
  //     // so here we will grab all the records from the DB (expect only one record) without passing any criteria,
  //     // and that record's name must be 'Alex'
  //     .then(() => User.find({}))
  //     .then(users => {
  //       assert(users.length === 1);
  //       assert(users[0].name === 'Alex');
  //       done();
  //     });
  // });

  it('instance type using set and save', done => {
    // We will update 'joe' name from 'Joe' to 'Alex'
    // This approach is better for updating more than one property of an user instance
    joe.set('name', 'Alex');
    assertName(joe.save(), done);
  });

  it('A model instance can update', done => {
    assertName(joe.update({ name: 'Alex' }), done);
  });

  it('A model class can update', done => {
    // find user records with a name of 'Joe', passed as a second argument, update the name to 'Alex'
    assertName(User.update({ name: 'Joe' }, { name: 'Alex' }), done);
  });

  it('A model class can update one record', done => {
    assertName(User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }), done);
  });

  it('A model class can find a record with an Id and update', done => {
    assertName(User.findByIdAndUpdate(joe._id, { name: 'Alex' }), done);
  });

  // here we are trying to increment postCount by 1 for every user in the User class
  // We are going to use Mongo Update Operators here
  // Update Operators let us send some instructions to Mongo and then Mongo will carry out the operation inside the DB
  // So here we are using $inc (increment operator) to increment postCount by a value 1
  // xit('A user can have their postcount incremented by 1', done => {
  //   User.update({ name: 'Joe' }, { $inc: { postCount: 1 } })
  //     .then(() => User.findOne({ name: 'Joe' }))
  //     .then(user => {
  //       assert(user.postCount === 1);
  //       done();
  //     });
  // });

  it('A user can have their postcount incremented by 1', done => {
    User.update({ name: 'Joe' }, { $inc: { likes: 1 } })
      .then(() => User.findOne({ name: 'Joe' }))
      .then(user => {
        assert(user.likes === 1);
        done();
      });
  });
});
