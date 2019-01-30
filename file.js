const fs = require('fs')
const mimeType = require('simple-mime')('application/octect-stream')
const {basename} = require('path')

module.exports = function(name) {
  const stat = fs.statSync(name)
  return {
    name: basename(name),
    type: mimeType(name),
    size: stat.size,
    lastModifiedDate: stat.mtime,
    lastModified: Number(stat.mtime)
    //webkitRelativePath : ""
  }
}
