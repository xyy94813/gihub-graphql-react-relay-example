process.stdin.resume();
process.stdin.setEncoding("utf8");
var fs = require("fs");

var filename = "src/Token.js";

if (fs.existsSync(filename)) {
  process.exit();
  return;
}

console.log("Enter Your GitHub API Token:");
process.stdin.on("data", function(text) {
  var tokenJS = `module.exports = "${text.trim()}"\n`

  fs.writeFile(filename, tokenJS, function(err) {
    console.log("API token has been saved in src/Token.js");
    process.exit();
  })
})
