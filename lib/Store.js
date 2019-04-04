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
}

module.exports = Store;
