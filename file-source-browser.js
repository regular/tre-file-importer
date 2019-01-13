const Pushable = require('pull-pushable')

module.exports = function(file, opts) {
  opts = opts || {}
  const bufferSize = opts.bufferSize || 2048
  let offset = 0
  let ended = false

  const pushable = Pushable(true, err => {
    ended = err
  })

  const reader = new global.FileReader()
 
  function read() {
    reader.readAsArrayBuffer(file.slice(offset, offset + bufferSize))
  }

  reader.onload = ({target}) => {
    pushable.push(target.result)
    if (target.result.byteLength == bufferSize && !ended) {
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
