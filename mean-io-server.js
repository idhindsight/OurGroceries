'use strict'

/*
var cl = console.log
console.log = function(){
  console.trace()
  cl.apply(console,arguments)
}
*/

// set up ====================
var express = require('express')
var app = express();
var mongoose = require('mongoose')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

process.env.NODE_CONFIG_DIR = './config/env'

mongoose.connect('mongodb://localhost/test')

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

// Requires meanio .
var mean = require('meanio')
var cluster = require('cluster')
var deferred = require('q').defer()
var debug = require('debug')('cluster')

// Code to run if we're in the master process or if we are not in debug mode/ running tests

if ((cluster.isMaster) &&
  (process.execArgv.indexOf('--debug') < 0) &&
  (process.env.NODE_ENV !== 'test') && (process.env.NODE_ENV !== 'development') &&
  (process.execArgv.indexOf('--singleProcess') < 0)) {
  // if (cluster.isMaster) {

  debug(`Production Environment`)
  // Count the machine's CPUs
  var cpuCount = process.env.CPU_COUNT || require('os').cpus().length

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    debug(`forking ${i}`)
    cluster.fork()
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {
    // Replace the dead worker, we're not sentimental
    debug(`Worker ${worker.id} died :(`)
    cluster.fork()
  })

// Code to run if we're in a worker process
} else {
  var workerId = 0
  if (!cluster.isMaster) {
    workerId = cluster.worker.id
  }
  // Creates and serves mean application
  mean.serve({ workerid: workerId }, function (app) {
    var config = app.getConfig()
    var port = config.https && config.https.port ? config.https.port : config.http.port
    debug(`MEAN app started on port ${port} (${process.env.NODE_ENV}) with cluster worker id ${workerId}`)

    deferred.resolve(app)
  })
}

module.exports = deferred.promise
