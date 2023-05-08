const { getDb } = require('../util/database');

class Notion {
  static async insertNotion(fileDetails, repoKey, fileId) {
    const db = getDb();
    const repoDetails = await db.collection('notion').findOne({ key: repoKey });
    if (repoDetails) {
      let repofiles = repoDetails['repoFiles'];
      repofiles[fileId] = fileDetails;
      db.collection('notion').updateOne({ key: repoKey }, { $set: { repoFiles: repofiles } });
    } else {
      let document = {
        key: repoKey,
        repoFiles: {
          [fileId]: fileDetails,
        },
      };
      db.collection('notion').insertOne(document);
    }
  }

  static async findByfileId(repoKey, fileId) {
    const db = getDb();
    const repoDetails = await db.collection('notion').findOne({ key: repoKey });
    if (repoDetails?.repoFiles?.[fileId]) {
      return repoDetails.repoFiles[fileId];
    }
    return {};
  }
}

module.exports = Notion;
