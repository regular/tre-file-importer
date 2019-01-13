const Source = require('pull-file')

module.exports = function(file, opts) {
  opts = opts || {}
  const bufferSize = opts.bufferSize || 2048
  return Source(file.name, {bufferSize})
}
