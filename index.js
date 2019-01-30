const pull = require('pull-stream')
const FileSource = require('./file-source')
const debug = require('debug')('tre-file-importer')

module.exports = function(ssb, config) {
  const importers = []

  function use(importer) {
    importers.push(importer)
  }

  // pass a single file or an array of files
  // if you pass an array of files, they will be imported
  // into _one_ message (if the importer back-end supports that at all)
  function importFiles(files, opts, cb) {
    if (typeof opts == 'function') {
      cb = opts
      opts = {}
    }
    opts = opts || {}
    files =  (!Array.isArray(files)) ? [files] : files

    console.log('Importing')
    files.forEach(file => {
      file.source = opts => FileSource(file, opts)
      console.log('-', file.name, file.type, file.size, file.lastModifiedDate)
    })
    if (!importers.length) return cb(new Error('There are no file importers'))
    const prototypes = Object.assign(
      {}, 
      config && config.tre && config.tre.prototypes || {},
      opts.prototypes || {}
    )
    debug('prototypes are %O', prototypes)
    pull(
      pull.values(importers),
      pull.asyncMap( (importer, cb) => {
        importer.importFiles(ssb, files, Object.assign({}, {prototypes}, opts), (err, content) =>{
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
    importFiles
  }
}
