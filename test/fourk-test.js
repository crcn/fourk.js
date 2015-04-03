var expect = require("expect.js");
var clust  = global.clust = require("..");
clust.script = "/base/test/script.bundle.js";
var script = require("./script-test");
var async = require("async");

// don't do anything if this is a worker
if (clust.isWorker) return;

describe(__filename + "#", function() {

  it("shows process as master", function() {
    expect(clust.isMaster).to.be(true);
  });

  it("can pass messages", function(next) {
    var worker = clust.fork();
    worker.on("pong", function() {
      worker.close();
      next();
    });
    worker.emit("ping", "pong");
  });

  it("applies a round robin for emitted messages", function(next) {

    var w1 = clust.fork();
    var w2 = clust.fork();

    w1.on("pong", function() {
      w2.on("pong", function() {
        w1.close();
        w2.close();
        next();
      });
      clust.emit("ping", "pong");
    });

    clust.emit("ping", "pong");
  });

  it("can broadcast a message to child ", function(next) {
    var w1 = clust.fork();
    var w2 = clust.fork();

    async.each([w1, w2], function(w, next) {
      w.on("pong", function() {
        next();
      });
    }, function() {
      w1.close();
      w2.close();
      next();
    });

    clust.broadcast("ping", "pong");
  });

  it("can broadcast a message from a child", function(next) {

    var w1 = clust.fork();
    var w2 = clust.fork();
    var w3 = clust.fork();

    async.each([w1, w2], function(w, next) {
      w.on("pong", function() {
        next();
      });
    }, function() {
      w1.close();
      w2.close();
      w3.close();
      next();
    });

    w3.emit("ping", "broadcast", "ping", "pong");
  });
});
