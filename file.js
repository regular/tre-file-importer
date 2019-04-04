const fs = require('fs')
const {basename} = require('path')
const mimeType = require('./mime-type')

module.exports = function(path) {
  const stat = fs.statSync(path)
  return {
    name: basename(path),
    type: mimeType(path),
    size: stat.size,
    lastModifiedDate: stat.mtime,
    lastModified: Number(stat.mtime),
    //webkitRelativePath : ""
    path
  }
}
