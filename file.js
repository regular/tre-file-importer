const fs = require('fs')
const mimeType = require('simple-mime')('application/octect-stream')

module.exports = function(name) {
  const stat = fs.statSync(name)
  return {
    name,
    type: mimeType(name),
    size: stat.size,
    lastModifiedDate: stat.mtime,
    lastModified: Number(stat.mtime)
    //webkitRelativePath : ""
  }
}
