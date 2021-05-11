var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var plugin = require("..")

function filename(name) {
  return "test/" + name + ".css"
}

function read(name) {
  return fs.readFileSync(name, "utf8")
}

function transform(css, options) {
  return postcss(plugin(options)).process(css).css
}

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}

  var actual = transform(read(postcssOpts.from), postcssOpts)
  var expected = read(filename("fixtures/" + name + ".expected"))

  fs.writeFileSync(filename("fixtures/" + name + ".actual"), actual)
  t.equal(actual, expected, msg)
}

test("hwb", function(t) {
  compareFixtures(t, "hwb", "should transform hwb")
  t.end()
})
