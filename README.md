Fourk allows you to spawn your web app on multiple threads. Similar to [cluster](https://nodejs.org/api/cluster.html).
Fourk works by taking the script it's executed from & re-spawning it as a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

#### Example

```javascript
var cluster = require("fourk");

if (cluster.isMaster) {
  for (var i = 4; i--;) cluster.fork()
} else {
  // do stuff as worker
}
```

#### Boolean cluster.isMaster

true if the current script is master

#### Boolean cluster.isWorker

true if the current script is a worker

#### worker master.fork()

creates a new child process

#### worker.close()

terminates the worker

#### cluster.broadcast(event[, ...args])

broadcasts a message to all workers

#### cluster.emit(event[, ...args])

Broadcasts a message to one worker. If the worker is emitting an event, it gets sent to master

#### cluster.on(event[, handler])

message handler

#### cluster.once(event[, handler])

adds one listener
