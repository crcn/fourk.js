var extend       = require("xtend/mutable");
var EventEmitter = require("events").EventEmitter;
var child        = require("./child");


/**
 */

function Master(script) {
  EventEmitter.call(this);
  this.script = script;
}

/**
 */

extend(Master.prototype, EventEmitter.prototype, {

  /**
   */

  isMaster: true,

  /**
   */

  fork: function () {
    console.log(this.script);
    var worker = new Worker(this.script);
    worker.onerror = function(e) {
      console.log(e);
    }
    var c = child(worker);
    c.on("exit", this._onChildExit.bind(this));
    return c;
  },

  /**
   */

  _onChildExit: function() {
    this.emit("exit");
  }
});

module.exports = function(script) {
  return new Master(script);
}
