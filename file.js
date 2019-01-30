const fs = require('fs')
const mimeType = require('simple-mime')('application/octect-stream')
const {basename} = require('path')

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
