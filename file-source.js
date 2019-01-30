const Source = require('pull-file')

module.exports = function(file, opts) {
  opts = opts || {}
  const bufferSize = opts.bufferSize || 2048
  const start = opts.start || 0
  const end = opts.end || Number.MAX_SAFE_INTEGER

  return Source(file.path, {bufferSize, start, end})
}
