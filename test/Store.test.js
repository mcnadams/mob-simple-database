const Store = require('../lib/Store');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const fs = require('fs');
const fsPromise = require('fs').promises;
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

  it('creates a file', () => {
    const kittems = {
      name: 'Kizmar'
    };
    return store.create(kittems)
      .then(savedObject => {
        expect(savedObject._id).toEqual(expect.any(String));
        return savedObject;
      })
      .then(savedObject => {
        const id = savedObject._id;
        const filePath = `${store.rootDirectory}/${id}`;
        return fsPromise.readFile(filePath, 'utf8')
          .then(data => {
            const parsedData = JSON.parse(data);
            expect(parsedData).toEqual(savedObject);
          });
      });
  });

  it.only('finds an file by id and parses object', () => {
    const puppers = {
      name: 'puppers'
    };
    return store.create(puppers)
      .then(objectToFind => {
        return Promise.all([
          Promise.resolve(objectToFind),
          store.findById(objectToFind._id)
        ]);
      })
      .then(([createdObject, foundObject]) => {
        expect(foundObject).toEqual(createdObject);
      });
  });

  it('searches a nonexistent file by id and returns null', () => {
    return store.findById('fakeID')
      .then(objectFromFile => expect(objectFromFile).toEqual(null));
  });

  it('find by ID and delete', done => {
    const puppers = {
      name: 'puppers'
    };
    store.create(puppers, (err, objectToFind) => {
      expect(err).toBeFalsy();
      store.findById(objectToFind._id, (error, objectFromFile) => {
        expect(objectFromFile).toEqual(objectToFind);
        store.findByIdAndDelete(objectFromFile._id, (err, object)=>
        {
          if(err){
            throw err;
          }
          expect(object.deleted).toBe(1);
        });
        done();
      });
    });
  });

  it('finds all objects in store and returns in an array', done => {
    const newObjects = [
      {
        name: 'Bonnie'
      },
      {
        name: 'Olli'
      }
    ];
    let newArray = [];
    store.create(newObjects[0], (err, newThing) => {
      if(err) done(err);
      newArray.push(newThing);
      store.create(newObjects[1], (err, newThing) => {
        if(err) done(err);
        newArray.push(newThing);
        store.find((err, arrayOfObjects) => {
          if(err) done(err);
          arrayOfObjects.forEach(item => {
            expect(newArray).toContainEqual(item);
            done();
          });
        });
      });
    });
  });
});
