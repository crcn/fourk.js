var Child     = require("./child");

var isWorker = typeof window === "undefined";

module.exports =  !isWorker ? require("./master")(getAppScript()) : require("./child")(self);

function getAppScript() {
  var scripts   = document.getElementsByTagName("script");
  return scripts[scripts.length - 1].src;
}
