var http = require('http'),
    httpProxy = require('http-proxy')

var lookupTable = {
 "default": "http://localhost:9090", // we want to get fast 404 for example to "/virkailija-raamit/"
 "haku-app": 'http://localhost:9090',
 "ao": 'https://testi.opintopolku.fi',
 "lop" : "https://testi.opintopolku.fi"
}

/*
var lookupTable = {
 "default": "http://localhost:9090", // we want to get fast 404 for example to "/virkailija-raamit/"
 "haku-app": 'http://localhost:9090',
 "ao": "https://test-oppija.oph.ware.fi",
 "lop":"https://test-oppija.oph.ware.fi"
}*/

// "lop":"https://test-virkailija.oph.ware.fi"

var proxy = httpProxy.createProxyServer({})

var server = http.createServer(function(req, res) {
  var urlPaths = req.url.split("/")
  var url = lookupTable[urlPaths[1]]
  console.log(req.url+ "\n\t\t\t-------->" + (url || lookupTable['default']))
  if (url) {
     proxy.web(req, res, { target: url })
  } else {  
     proxy.web(req, res, { target: lookupTable['default'] })
  }
})

console.log("I am ready for you in port 8080")
server.listen(8080)
