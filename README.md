# WebScan

## Usage

```
const webScan = require('webscan')

webScan('npmjs.com').then((response)=>{
    console.log(response)
})
```

Responses will be

```
{
    SSL_CERTIFICATE : {},
    HTTP_CERTIFICATE : {},
    PAGES : [],
}
```