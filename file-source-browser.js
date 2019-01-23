const Pushable = require('pull-pushable')

module.exports = function(file, opts) {
  opts = opts || {}
  const bufferSize = opts.bufferSize || 2048
  let offset = opts.start || 0
  let togo = (opts.end || Number.MAX_SAFE_INTEGER) - offset
  let ended = false

  const pushable = Pushable(true, err => {
    ended = err
  })

  const reader = new global.FileReader()
 
  function read() {
    reader.readAsArrayBuffer(file.slice(offset, offset + Math.min(bufferSize, togo)))
  }

  reader.onload = ({target}) => {
    pushable.push(target.result)
    togo -= target.result.byteLength
    if (target.result.byteLength == bufferSize && !ended && togo) {
      offset += bufferSize
      read()
    } else {
      pushable.end()
    }
  }
  reader.onerror = err => {
    ended = err
    pushable.end(err)
  }
  read()
  return pushable.source
}
