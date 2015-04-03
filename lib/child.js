var extend       = require("xtend/mutable");
var EventEmitter = require("events").EventEmitter;

/**
 */

function Child(target) {
  EventEmitter.call(this);
  this.target = target;

  target.addEventListener("message", this._onMessage.bind(this));
  target.addEventListener("error", this._emit.bind(this, "error"));
}

/**
 */

extend(Child.prototype, EventEmitter.prototype, {

  /**
   */

  isWorker: true,

  /**
   * broadcast to all child workers
   */

  broadcast: function() {
    this.emit.apply(["broadcast"].concat(Array.prototype.slice.call(arguments)));
  },

  /**
   */

  emit: function() {
    var args = Array.prototype.slice.call(arguments);
    this.target.postMessage(args);
  },

  /**
   */

  close: function() {
    this.target.close ? this.target.close() : this.target.terminate();
    this._onClose();
  },


  /**
   */

  _emit: function() {
    EventEmitter.prototype.emit.apply(this, arguments);
  },

  /**
   */

  _onMessage: function(message) {
    this._emit.apply(this, message.data);
    this._emit.apply(this, ["message"].concat(message.data));
  },

  /**
   */

  _onClose: function() {
    this._emit("close");
  }
});

module.exports = function(target) {
  return new Child(target);
};
