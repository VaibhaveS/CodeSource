const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      'mongodb+srv://Satya:YexT5UMxIj19b446@cluster0.csxobb4.mongodb.net/?retryWrites=true&w=majority')
    .then((client) => {
      console.log('Connected..');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'no db found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
