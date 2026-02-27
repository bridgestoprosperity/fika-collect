const storage = {
  setString: jest.fn(),
  getString: jest.fn(),
  setInt: jest.fn(),
  getInt: jest.fn(),
  setBool: jest.fn(),
  getBool: jest.fn(),
  setMap: jest.fn(),
  getMap: jest.fn(() => null),
  setArray: jest.fn(),
  getArray: jest.fn(() => null),
  removeItem: jest.fn(),
  clearStore: jest.fn(),
};

const MMKVLoader = jest.fn().mockImplementation(() => ({
  withInstanceID: jest.fn().mockReturnThis(),
  withEncryption: jest.fn().mockReturnThis(),
  initialize: jest.fn().mockReturnValue(storage),
}));

module.exports = { MMKVLoader };
