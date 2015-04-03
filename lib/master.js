var extend       = require("xtend/mutable");
var EventEmitter = require("events").EventEmitter;
var child        = require("./child");


/**
 */

function Master(script) {
  EventEmitter.call(this);
  this.script    = script;
  this._i        = 0;
  this._children = [];
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
    var worker = new Worker(this.script);
    var c = child(worker);
    this._children.push(c);
    c.on("broadcast", this.broadcast.bind(this));
    c.on("message", this._emit.bind(this));
    c.once("close", function() {
      this._children.splice(this._children.indexOf(c), 1);
    }.bind(this));
    return c;
  },

  /**
   */

  emit: function() {
    var args = Array.prototype.slice.apply(arguments);
    if (!this._children.length) throw new Error("no forked processes");
    var index = this._i % this._children.length;
    var child = this._children[index];
    this._i = index + 1;
    child.emit.apply(child, args);
  },

  /**
   */

  _emit: function() {
    EventEmitter.prototype.emit.apply(this, arguments);
  },

  /**
   */

   broadcast: function() {
     var args = Array.prototype.slice.apply(arguments);
     for (var i = this._children.length; i--;) {
       var child = this._children[i];
       child.emit.apply(child, args);
     }
   }
});

/**
 */

module.exports = function(script) {
  return new Master(script);
}
