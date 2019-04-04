const fs = require('fs');
const uuid = require('uuid/v4');

class Store {
  constructor(rootDirectory) {
    this.rootDirectory = rootDirectory;
  }
  create(objectToSave, callback) {
    const id = uuid();
    const savedObject = {...objectToSave, _id: id };const data = JSON.stringify(savedObject);
    const filePath = `${this.rootDirectory}/${id}`;
    fs.writeFile(filePath, data, (err) => {
      callback(err, savedObject);
    });
  }
  findById(_id, callback) {    
    const file = `${this.rootDirectory}/${_id}`;
    fs.readFile(file, 'utf8', (err, data) => {
      const parsedObject = data && JSON.parse(data) || null;
      callback(err, parsedObject);
    });
  }
  findByIdAndDelete(_id, callback) {
    const file = `${this.rootDirectory}/${_id}`;
    this.findById(file, (err, objectToDelete) => {
      if(objectToDelete) {
        fs.unlink(file, () => {

        })
        callback(err, { deleted: 1 });
      }
    })
  }
  find(callback) {
    let arrayOfObjects = [];
    fs.readdir(this.rootDirectory, (err, arrayOfFiles) => {
      if(err) throw err;
      arrayOfFiles.forEach(_id => {
        const filePath = `${this.rootDirectory}/${_id}`;
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
          const data = JSON.parse(jsonData);
          arrayOfObjects.push(data);
          if(arrayOfFiles.length === arrayOfObjects.length) {
            callback(err, arrayOfObjects);
          }
        });
      });
    });
  }
}

module.exports = Store;
