/**
 * Module dependencies.
 */
var color = require("color")
var reduceFunctionCall = require("reduce-function-call")

/**
 * PostCSS plugin to transform hwb() to rgb()
 */
module.exports = function plugin() {
  return function(style) {
    style.eachDecl(function transformDecl(dec) {
      if (!dec.value) {
        return
      }

      dec.value = transform(dec.value, dec.source)
    })
  }
}

/**
 * Transform hwb color to rgb() or rgba()
 *
 * @param {String} string
 * @return {String}
 */
function transform(string, source) {
  try {
    if (string.indexOf("hwb(") > -1) {
      string = transformHwb(string, source)
    }
  }
  catch (e) {
    throw new Error(gnuMessage(e.message, source))
  }

  return string
}


/**
 * transform hwb() to rgb() (or rgba())
 *
 * @param  {String} string declaration value
 * @return {String}        converted declaration value to rgba()
 */
function transformHwb(string) {
  return reduceFunctionCall(string, "hwb", function(body, fn) {
    return color(fn + "(" + body + ")").rgbString()
  })
}

/**
 * return GNU style message
 *
 * @param {String} message
 * @param {Object} source
 */
function gnuMessage(message, source) {
  return (source ? (source.file ? source.file : "<css input>") + ":" + source.start.line + ":" + source.start.column + " " : "") + message
}
