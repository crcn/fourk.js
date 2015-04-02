if(clust.isWorker) {
  clust.worker.on("ping", function(value) {
    clust.worker.emit("pong", value);
  });
}
