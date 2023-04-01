const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      "mongodb+srv://akash_01:0iSH43pmgvOfeQc1@cluster0.4w0a95i.mongodb.net/code_source?retryWrites=true&w=majority"
    )
    .then((client) => {
      console.log("Connected..");
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
  throw "no db found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
