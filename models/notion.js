const { getDb } = require('../util/database');

const mongoConnect = require('../util/database').getDb;

class Notion {
  static async insertNotion(fileDetails, repoKey, fileId) {
    const db = getDb();
    const repoDetails = await db.collection('Notion').findOne({ key: repoKey });
    let fileIdExists = false;
    if (repoDetails) {
      let repofiles = repoDetails['repoFiles'];
      for (const [key, value] of Object.entries(repofiles)) {
        for (let i in value) {
          let currFileId = Number(i);
          if (currFileId == fileId) {
            fileIdExists = true;
            repofiles[key][currFileId] = fileDetails;
            db.collection('Notion').updateOne({ key: repoKey }, { $set: { repoFiles: repofiles } });
            break;
          }
        }
        if (fileIdExists) break;
      }
    }
    if (repoDetails && !fileIdExists) {
      let fileDict = {};
      fileDict[fileId] = fileDetails;
      db.collection('Notion').updateOne({ key: repoKey }, { $push: { repoFiles: fileDict } });
    } else if (!fileIdExists) {
      let document = {};
      document['key'] = repoKey;
      let repofiles = [];
      let fileDict = {};
      fileDict[fileId] = fileDetails;
      repofiles.push(fileDict);
      document['repoFiles'] = repofiles;
      db.collection('Notion').insertOne(document);
    }
  }
  static async findByfileId(repoKey, fileId) {
    const db = getDb();
    const repoDetails = await db.collection('Notion').findOne({ key: repoKey });
    let fileIdExists = false;
    if (repoDetails) {
      let repofiles = repoDetails['repoFiles'];
      for (const [key, value] of Object.entries(repofiles)) {
        for (let i in value) {
          let currFileId = Number(i);
          if (currFileId == fileId) {
            fileIdExists = true;
            return repofiles[key][currFileId];
            break;
          }
        }
      }
      return {};
    }
  }
}

module.exports = Notion;
