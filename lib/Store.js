
const uuid = require('uuid/v4');

class Store {
  constructor(rootDirectory) {
    this.rootDirectory = rootDirectory;
  }
  create(objectToSave, callback) {
    //create the _id
    const savedObject = {...objectToSave, _id: uuid() }; 
    //write the json file

    //callback(err, objwithid)
    callback(null, savedObject);

  }
}

module.exports = Store;
