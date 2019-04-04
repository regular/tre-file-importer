const simpleMime = require('simple-mime')('application/octect-stream')

module.exports = function mimeType(path) {
  if (path.endsWith('.vtt')) return 'text/vtt'
  return simpleMime(path)
}
