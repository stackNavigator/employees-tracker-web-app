const fs = require('fs')
const { homedir } = require('os')
const { join } = require('path')

module.exports = {
  normalizeFilePath (docs) {
    for (let doc of docs) {
      const user = /(.+)[\\\/]Desktop/g.exec(doc.image)[1]
      if (homedir() === user)
        continue
      doc.image = doc.image.replace(user, homedir())
    }
  },
  createFilePath (docName) {
    return join(homedir(), 'Desktop', 'employees', 
        new Date().toISOString().replace(/[\s\-\:]/g, '') + docName)
  },
  copyFile (path, dest) {
    fs.copyFile(path, dest, err => {
      try {
        if (err) {
          throw new Error(err)
        }
      }
      catch (err) {
        console.log(err)
      }
    })
  }
}