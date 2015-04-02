Fourk allows you to spawn your web app on multiple threads. Similar to [cluster](https://nodejs.org/api/cluster.html).
Fourk works by taking the script it's executed from & re-spawning it as a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

#### Example

```javascript
var cluster = require("fourk");

if (cluster.isMaster) {

  function createWorker() {
    var worker = cluster.fork();
    worker.on("hello", function() {
    });
  }
  for (var i = 4; i--;) createWorker();
  cluster.on("exit", createWorker);
} else {
  cluster.worker.emit("hello");
}
```

#### Boolean cluster.isMaster
#### Boolean cluster.isWorker
