const Store = require('../lib/Store');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

describe('Store class', () => {
  beforeEach(done => {
    mkdirp('./animals', done);
  });
  afterEach(done => {
    rimraf('./animals', done);
  });
  it('binds directory path in store', () => {
    const rootDirectory = path.join(__dirname, 'animals');
    const store = new Store(rootDirectory);
    console.log(rootDirectory);
    expect(store.rootDirectory).toBe(rootDirectory);
  });
  it('creates a file', done => {
    const rootDirectory = path.join(__dirname, 'animals');
    const store = new Store(rootDirectory);
    const kittems = {
      name: 'Kizmar'
    }
    store.create(kittems, (err, savedObject) => {
      expect(savedObject._id).toEqual(expect.any(String));
      done();
    });
    
  })
});
