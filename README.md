Fourk allows you to spawn your web app on multiple threads. Similar to [cluster](https://nodejs.org/api/cluster.html). 

```javascript
var cluster = require("fourk");

if (cluster.isMaster) {
  for (var i = 4; i--;) cluster.fork();
  
  //re-spawn
  cluster.on("exit", cluster.fork);
}
```
