var extend       = require("xtend/mutable");
var EventEmitter = require("events").EventEmitter;

/**
 */

function Child(target) {
  EventEmitter.call(this);
  this.target = target;
  target.addEventListener("message", this._onMessage.bind(this));
  target.addEventListener("error", this.emit.bind(this, "error"));
}

/**
 */

extend(Child.prototype, EventEmitter.prototype, {

  /**
   */

  isWorker: true,

  /**
   */

  emit: function() {
    this.target.postMessage(JSON.stringify(Array.prototype.slice.call(arguments)));
  },

  /**
   */

  _onMessage: function() {
    console.log("MESS");
  }
});

module.exports = function(target) {
  return new Child(target);
};
