var Child     = require("./child");
var scripts   = document.getElementsByTagName("script");
var appScript = scripts[scripts.length - 1].src;

var isWorker = typeof window.document === "undefined";

module.exports =  !isWorker ? require("./master")(appScript) : require("./child")({
  addEventListener : self.addEventListener.bind(self),
  postMessage      : postMessage
});
