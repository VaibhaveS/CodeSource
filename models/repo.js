const { getDb } = require('../util/database');

const mongoConnect = require('../util/database').getDb;

class Repo {
  constructor(userId, repoName, details) {
    this.key = userId + '#' + repoName;
    this.details = details;
    console.log('!!!!!!!');
    //console.log(type(details));
    console.log(details);
  }

  save() {
    const db = getDb();
    return db
      .collection('repos')
      .countDocuments()
      .then((count) => {
        console.log(this);
        this.RepoId = count + 1;
        var fileCount = 0;
        for (let component in this.details['dirTree']) {
          console.log(component);
          if (component == 'files') {
            let fileCounter = 0;
            let oldFiles = this.details.dirTree[component];
            let newFiles = [];
            for (var i = 0; i < oldFiles.length; i++) {
              newFiles.push([oldFiles[i], fileCounter]);
              fileCounter += 1;
            }
            this.details.dirTree['files'] = newFiles;
            console.log(newFiles);
            continue;
          }
          for (let key in this.details.dirTree[component]) {
            console.log(key);
            if (key == 'files') {
              let newFiles = [];
              let fileCounter = 0;
              console.log(this.details.dirTree[component][key]);
              let oldFiles = this.details.dirTree[component][key];
              for (var i = 0; i < oldFiles.length; i++) {
                newFiles.push([oldFiles[i], fileCounter]);
                fileCounter += 1;
              }
              console.log(newFiles);
              //component['files'] = newFiles;
              this.details.dirTree[component]['files'] = newFiles;
            }
          }
        }
        return db.collection('repos').insertOne(this);
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findAll() {
    const db = getDb();
    return db
      .collection('repos')
      .find()
      .toArray()
      .then((repos) => {
        console.log('returning', repos);
        return repos;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByKey(key) {
    const db = getDb();
    return db.collection('repos').findOne({ key: key });
  }
  static insertNotion(document, repoKey) {
    const db = getDb();
    const details = db.collection('Notion').findOne({ repoKey: repoKey });
    if (details.size()) {
      db.collection.updateOne({ repoKey: key }, { $push: document });
    } else {
      document['Key'] = repoKey;
      db.collection('Notion').insertOne(document);
    }
  }
  static findByfileId(repoKey, fileId) {
    // repoKey = userId + '#' + repoName
    /*
      repoKey:
        fileId:
          UID:
            HTML
            Tags
          UID:
            HTML
            Tags
    */
    const db = getDb();
    let details = db.collection('Notion').findOne({ repoKey: repoKey });
    return details.findOne({ fileId: fileId }).toArray();
  }
}

module.exports = Repo;
