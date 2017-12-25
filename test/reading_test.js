const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
  let joe, maria, alex, zach;

  // before we find a user with a name 'joe', we need to first add in a user with name Joe
  // this is because in test_helper we drop our entire user collection, hence there would no 'joe' user to find
  // so add user 'joe' using beforeEach, as this will run before any 'it' block tests in this file

  beforeEach(done => {
    alex = new User({ name: 'Alex' });
    joe = new User({ name: 'Joe' });
    maria = new User({ name: 'Maria' });
    zach = new User({ name: 'Zach' });

    Promise.all([alex.save(), joe.save(), maria.save(), zach.save()]).then(() =>
      done()
    );
    // joe.save().then(() => done()); // once done is called Mocha can go on to execute new test
  });

  // here User.find will return all records with name 'Joe'
  // in this test, we will compare joe's _id with the record's _id saved and extracted from Mongo
  it('finds all users with a name of joe', done => {
    User.find({ name: 'Joe' }).then(users => {
      // console.log(users);
      // here we should see our single user 'joe' created and saved in Mongo in above beforeEach block
      // console.log(users[0]._id);
      // console.log(joe._id);

      // _id is an Object ID and not a normal String
      // hence 'users[0]._id == joe._id' test fails

      assert(users[0]._id.toString() == joe._id.toString());
      done(); // once done is called Mocha can go on to execute new test
    });
  });

  // findOne returns a single user
  // in this test we want to find a user with a very particular id, and check if that user's id is equal to Joe's id
  it('find a user with a particular id', done => {
    User.findOne({ _id: joe.id }).then(user => {
      assert(user.name === 'Joe');
      done();
    });
  });

  it('can skip and limit the result set', done => {
    // so if we have in the DB : Alex Joe Maria Zach
    // by running the following query, we only expect to see Joe & Maria in the result set,
    // as we skipped Alex and the limited result to 2 records
    // -Alex- [Joe Maria] Zach
    User.find({})
      .sort({ name: 1 })
      // sort all of the users by name property and '1' : sort them in ascending fashion, '-1' for descending
      // this way the db entries returned are always in this order : Alex Joe Maria Zach
      .skip(1)
      .limit(2)
      .then(users => {
        assert(users.length === 2);
        assert(users[0].name === 'Joe');
        assert(users[1].name === 'Maria');
        done();
      });
  });
});
