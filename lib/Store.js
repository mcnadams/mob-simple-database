const fs = require('fs');
const uuid = require('uuid/v4');

class Store {
  constructor(rootDirectory) {
    this.rootDirectory = rootDirectory;
  }
  create(objectToSave, callback) {
    //create the _id
    const id = uuid();
    const savedObject = {...objectToSave, _id: id }; 
    //write the json file
    const data = JSON.stringify(savedObject);
    const filePath = `${this.rootDirectory}/${id}`;
    fs.writeFile(filePath, data, (err) => {
      callback(err, savedObject);
    });
    //callback(err, objwithid)

  }
}

module.exports = Store;
