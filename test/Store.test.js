const Store = require('../lib/Store');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const fs = require('fs');
const rootDirectory = path.join(__dirname, '../', 'animals');

let store;

describe('Store class', () => {
  beforeEach(done => {
    mkdirp(rootDirectory, done);
    store = new Store(rootDirectory);
  });
  afterEach(done => {
    rimraf(rootDirectory, done);
  });
  it('binds directory path in store', () => {
    expect(store.rootDirectory).toBe(rootDirectory);
  });
  it('creates a file', done => {
    const kittems = {
      name: 'Kizmar'
    }
    store.create(kittems, (err, savedObject) => {
      if (err) {
        throw err;
      }
      expect(savedObject._id).toEqual(expect.any(String));
      const id = savedObject._id;
      const filePath = `${store.rootDirectory}/${id}`;
      fs.readFile(filePath, 'utf8', (err, data) => {
        const parsedData = JSON.parse(data);
        expect(parsedData).toEqual(savedObject);
        done();
      });
    });
  });

  it('finds an file by id and parses object', done => {
    const puppers = {
      name: 'puppers'
    }
    store.create(puppers, (err, objectToFind) => {
      console.log('new object', objectToFind);
      expect(err).toBeFalsy();
      store.findById(objectToFind._id, (error, objectFromFile) => {
        expect(objectFromFile).toEqual(objectToFind);
        done();
      });
    });
  });
  it('searches a nonexistent file by id and returns null', done => {
    store.findById('fakeID', (error, objectFromFile) => {
      expect(objectFromFile).toEqual(null);
      done();
    });
  });
  it('find by ID and delete', done => {
    const puppers = {
      name: 'puppers'
    }
    store.create(puppers, (err, objectToFind) => {
      console.log('new object', objectToFind);
      expect(err).toBeFalsy();
      store.findById(objectToFind._id, (error, objectFromFile) => {
        expect(objectFromFile).toEqual(objectToFind);
        store.findByIdAndDelete(objectFromFile._id, (err, object)=>
        {
          if(err){
            throw err;
          }
          expect(object.deleted).toBe(1)
        })
        done();
      });
    })
  });
});
