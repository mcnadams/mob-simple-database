const Store = require('../lib/Store');
const path = require('path');

describe('Store class', () => {
  it('binds directory path in store', () => {
    const rootDirectory = path.join(__dirname, 'animals');
    const store = new Store(rootDirectory);
    console.log(rootDirectory);
    expect(store.rootDirectory).toBe(rootDirectory);
  });
});
