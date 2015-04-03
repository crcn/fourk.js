Fourk allows you to spawn your web app on multiple threads. Similar to [cluster](https://nodejs.org/api/cluster.html).
Fourk works by taking the script it's executed from & re-spawning it as a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

#### Browserify Example

```javascript
var cluster = require("fourk")();

if (cluster.isMaster) {

  // just call fork and you're good to go
  for (var i = 4; i--;) cluster.fork()
} else {
  // do stuff as worker
}
```

#### Boolean cluster.isMaster

true if the current script is master

```javascript
var cluster = require("fourk")();
if (cluster.isMaster) {
  // do master stuff
}
```

#### Boolean cluster.isWorker

true if the current script is a worker

```javascript
var cluster = require("fourk")();
if (cluster.isWorker) {
  // do worker stuff
}
```

#### worker master.fork()

Creates a new child process. Can only be called from master.

```javascript
var cluster = require("fourk")();
if (cluster.isMaster) {
  var worker = cluster.fork();
}
```

#### worker.close()

terminates the worker

#### cluster.broadcast(event[, ...args])

Broadcasts a message to all workers. Can be called from master or workers.

On master:

```javascript
var cluster = require("fourk")();
if (cluster.isMaster) {
  for (var i = 4; i--;) cluster.fork();
  cluster.broadcast("hello", "bob");
} else {
  cluster.on("hello", function(name) {
    console.log("hello %s!", name);  // hello bob! x 4
  });
}
```

on workers:

```javascript
var cluster = require("fourk")();
if (cluster.isMaster) {
  for (var i = 4; i--;) cluster.fork();
} else {
  cluster.on("hello", function(name) {
    console.log("hello %s!", name);  // hello bob! x 4
  });
  cluster.broadcast("hello", "bob");
}
```


#### cluster.emit(event[, ...args])

Broadcasts a message to a worker - round-robin style. If a worker emits a message, it gets sent
to master.

Master example:

```javascript
var cluster = require("fourk")();
if (cluster.isMaster) {
  for (var i = 4; i--;) cluster.fork();
  cluster.emit("hello", "bob"); // first worker
  cluster.emit("hello", "bob"); // second worker
  cluster.emit("hello", "bob"); // third worker
} else {
  cluster.on("hello", function(name) {
    console.log("hello %s!", name);  // hello bob! x 3
  });
}
```

Worker example:

```javascript
var cluster = require("fourk")();
if (cluster.isMaster) {
  cluster.fork();
  cluster.on("hello", function(name) {
    console.log("hello %s!", name);  // hello bob! x 1
  });
} else {
  cluster.emit("hello", "bob");
}
```


#### cluster.on(event[, handler])

listens for events passed around between workers.

#### cluster.once(event[, handler])

listens for one worker, then disposes it.
