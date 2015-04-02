var expect = require("expect.js");
var clust  = global.clust = require("..");
clust.script = "/base/test/script.js";
var script = require("./script");

// don't do anything if this is a worker
if (clust.isWorker) return;

describe(__filename + "#", function() {

  it("shows process as master", function() {
    expect(clust.isMaster).to.be(true);
  });

  it("can fork a process", function(next) {
    var worker = clust.fork();
    worker.on("pong", function() {
      next();
    });
    worker.emit("ping");
  });
});
