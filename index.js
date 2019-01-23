const pull = require('pull-stream')
const Source = require('./file-source')

module.exports = function(ssb, config) {
  const importers = []

  function use(importer) {
    importers.push(importer)
  }

  function importFile(file, opts, cb) {
    console.log('Importing', file.name, file.type, file.size, file.lastModifiedDate)
    if (!importers.length) return cb(new Error('There are no file importers'))
    const prototypes = config && config.tre && config.tre.prototypes || opts.prototypes || {}
    console.log('import file prototypes', prototypes)
    pull(
      pull.values(importers),
      pull.asyncMap( (importer, cb) => {
        importer.importFile(ssb, file, Source(file), {prototypes}, (err, content) =>{
          if (err == true) return cb(null, null)  // not my job
          if (err) return cb(err)
          cb(null, content)
        })  
      }),
      pull.filter(),
      pull.take(1),
      pull.collect( (err, results) => {
        if (err) return cb(err)
        const content = results[0]
        if (!content) return cb(new Error('importer returned no content'))
        cb(null, content)
      })
    )
  } 
  
  return {
    use,
    importFile
  }
}
