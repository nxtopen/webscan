const webScan = require('../src/index')

webScan('npmjs.com').then((response)=>{
    console.log(response)
})