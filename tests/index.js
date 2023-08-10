const webScan = require('../src/index')

webScan('bookmyshow.com').then((response)=>{
    console.log(response)
})