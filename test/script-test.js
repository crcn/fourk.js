var clust = require("..");

if (clust.isWorker) {
  clust.on("ping", function(event) {
    clust.emit.apply(clust, Array.prototype.slice.apply(arguments));
  });
}
