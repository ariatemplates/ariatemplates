// This the packman packaging main entry point
// To be called from the ariatemplates root folder `node build/build.js`
// Anyway, you should NOT be executing this directly, use `npm install` instead (this will make sure dependencies are available)

var spawn = require('child_process').spawn;
var fs = require("fs");
var util = require("util");
var mkdirp = require("mkdirp");

function runCmd(cmd, args, callback) {
	var childProcess = spawn(cmd, args);
	childProcess.stdout.on('data', function (data) {
		console.log(data+"");
	});
	childProcess.stderr.on('data', function (data) {
		console.log(data+"");
	});
	childProcess.on('exit', function (code) {
		// TODO: When packman issue 7 will be implemented, we will have real exit codes to deal with failing packages
		// https://github.com/captainbrosset/packman/issues/7
		if(code === 1) {
			process.exit(1);
		} else {
			callback(code);
		}
	});
}

var packmanLint = ['node_modules/packman/packman.js', '-c', 'build/lint.yaml', '-n'];
var packmanBootstrap = ['node_modules/packman/packman.js', '-c', 'build/at-bootstrap.yaml', '-n'];
var packmanRelease = ['node_modules/packman/packman.js', '-c', 'build/releases/standard/config.yaml', '-n'];

runCmd("node", packmanLint, function(code) {
	runCmd("node", packmanBootstrap, function(code) {
		runCmd("node", packmanRelease, function(code) {
			// ugly way to copy binary files, they are not handled by packman
			var src = __dirname + "/../src/aria/resources/handlers/IO.swf";
			var dstFolder = __dirname + "/releases/standard/target/aria/resources/handlers";
			var dst = dstFolder + "/IO.swf";

			mkdirp.sync(dstFolder);
			var inputStream = fs.createReadStream(src);
			var outputStream = fs.createWriteStream(dst);
			util.pump(inputStream, outputStream, function (error) {
				if (error) {
					process.exit(1);
				}
			});
		});
	});
});