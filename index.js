/**
 * Module dependencies.
 */
var color = require("color")
var reduceFunctionCall = require("reduce-function-call")
var helpers = require("postcss-message-helpers")

/**
 * PostCSS plugin to transform hwb() to rgb()
 */
module.exports = function plugin() {
  return function(style) {
    style.eachDecl(function transformDecl(decl) {
      if (!decl.value || decl.value.indexOf("hwb(") === -1) {
        return
      }

      decl.value = helpers.try(function transformHwb() {
        return reduceFunctionCall(decl.value, "hwb", function reduceHwb(body, fn) {
          return color(fn + "(" + body + ")").rgbString()
        })
      }, decl.source)
    })
  }
}
