const fs = require('fs');
const fsPromise = require('fs').promises;
const uuid = require('uuid/v4');

class Store {
  constructor(rootDirectory) {
    this.rootDirectory = rootDirectory;
  }
  create(objectToSave) {
    const id = uuid();
    const savedObject = { ...objectToSave, _id: id };
    const data = JSON.stringify(savedObject);
    const filePath = `${this.rootDirectory}/${id}`;
    return fsPromise.writeFile(filePath, data)
      .then(() => {
        return savedObject;
      });
  }
  findById(_id) {    
    const file = `${this.rootDirectory}/${_id}`;
    return fsPromise.readFile(file, 'utf8')
      .then(data => JSON.parse(data));
  }

  findByIdAndDelete(_id, callback) {
    const file = `${this.rootDirectory}/${_id}`;
    this.findById(file, (err, objectToDelete) => {
      if(objectToDelete) {
        fs.unlink(file, () => {

        });
        callback(err, { deleted: 1 });
      }
    });
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
