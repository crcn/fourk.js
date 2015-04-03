var child  = require("./child");
var master = require("./master");

var isWorker = typeof window === "undefined";

module.exports = function(script) {
  return !isWorker ? master(script || getAppScript()) : child(self);
}

function getAppScript() {
  var scripts   = document.getElementsByTagName("script");
  return scripts[scripts.length - 1].src;
}
