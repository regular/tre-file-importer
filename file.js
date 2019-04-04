const fs = require('fs')
const simpleMime = require('simple-mime')('application/octect-stream')
const {basename} = require('path')

function mimeType(path) {
  if (path.endsWith('.vtt')) return 'text/vtt'
  return simpleMime(path)
}

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
