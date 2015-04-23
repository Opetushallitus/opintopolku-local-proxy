#!/usr/bin/env node
var http = require('http'),
    httpProxy = require('http-proxy'),
    fs = require('fs');


var configFile = process.argv[2] || "oph-proxy-config.json";
console.log("Using configuration file " + configFile);

if (!fs.existsSync(configFile)) {
  console.log("Config file not found!")
  process.exit(1)
}

var config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
var lookupTable = config.lookupTable;

console.log(config)

var proxy = httpProxy.createProxyServer({})

var server = http.createServer(function(req, res) {
  var urlPaths = req.url.split("/")
  var url = lookupTable[urlPaths[1]]
  console.log(req.url+ "\n\t\t\t-------->" + (url || lookupTable['default']))
  if (url) {
     proxy.web(req, res, { target: url }, errorHandlr)
  } else {
     proxy.web(req, res, { target: lookupTable['default'] }, errorHandlr)
  }
  function errorHandlr(e) {
    console.log("ERROR", e)
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write("Proxy error: " + e);
    res.end();
  }
})

console.log("I am ready for you in port " + config.port)
server.listen(config.port)
