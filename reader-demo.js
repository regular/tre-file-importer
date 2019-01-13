const pull = require('pull-stream')
const Source = require('./file-source')
const h = require('mutant/html-element')
const Value = require('mutant/value')
const computed = require('mutant/computed')

const progress = Value(0)

document.body.appendChild(
  h('.upload', [
    h('div', {
      style: {
        display: 'inline-block',
        margin: 0,
        padding: 0,
        background: '#ddd',
        width: '200px',
        height: '20px'
      }
    }, [
      h('div', {
        style: {
          background: 'blue',
          height: '100%',
          width: computed(progress, progress => `${progress * 100}%`)
        }
      })
    ]),
    h('input', {
      type: 'file',
      'ev-change': e => {
        const files = e.target.files
        Array.from(files).forEach( file => {
          console.log('file', file)
          const {size} = file
          console.log('size', size)
          let sofar = 0
          pull(
            Source(file),
            pull.through(buffer=>{
              sofar += buffer.byteLength
              progress.set(sofar/size)
            }),
            pull.asyncMap( (b, cb)=>{
              setTimeout( ()=>{
                cb(null, b)
              }, 20)
            }),
            pull.collect( (err, buffers) => {
              console.log('err', err)
            })
          )
        })
      }
    })
  ])
)

