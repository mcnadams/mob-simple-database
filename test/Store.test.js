const Store = require('../lib/Store');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const fs = require('fs'); 
const rootDirectory = path.join(__dirname,'../', 'animals');

describe('Store class', () => {
  beforeEach(done => {
    mkdirp(rootDirectory, done);
  });
 afterEach(done => {
   rimraf(rootDirectory, done);
 });
  it('binds directory path in store', () => {
    const store = new Store(rootDirectory);
    expect(store.rootDirectory).toBe(rootDirectory);
  });
  it('creates a file', done => {
    const store = new Store(rootDirectory);
    const kittems = {
      name: 'Kizmar'
    }
    store.create(kittems, (err, savedObject) => {
      if(err){
        throw err;
      }

      expect(savedObject._id).toEqual(expect.any(String));
      const id = savedObject._id;
      //read saved file by id
      const filePath = `${store.rootDirectory}/${id}`;
      fs.readFile(filePath, 'utf8', (err, data) => { 
        const parsedData = JSON.parse(data);
        expect(parsedData).toEqual(savedObject);
        done();
      });
      //compare to saved object
    });   
  })
});
