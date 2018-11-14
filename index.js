const pull = require('pull-stream')

module.exports = function(ssb) {
  const importers = []

  function use(importer) {
    importers.push(importer)
  }

  function importFile(file, opts, cb) {
    pull(
      pull.values(importers),
      pull.asyncMap( (importer, cb) => {
        importer.importFile(ssb, file, opts, (err, content) =>{
          if (err == true) return cb(null, null)  // not my job
          if (err) return cb(err)
          cb(null, content)
        })  
      }),
      pull.filter(),
      pull.take(1),
      pull.collect( (err, results) => {
        if (err) return cb(err)
        cb(null, results[0])
      })
    )
  } 
  
  return {
    use,
    importFile
  }
}
