// This the packman packaging main entry point
// To be called from the ariatemplates root folder `node build/build.js`
// Anyway, you should NOT be executing this directly, use `npm install` instead (this will make sure dependencies are available)

var spawn = require('child_process').spawn;

function runCmd(cmd, args, callback) {
	var childProcess = spawn(cmd, args);
	childProcess.stdout.on('data', function (data) {
		console.log(data+"");
	});
	childProcess.stderr.on('data', function (data) {
		console.log(data+"");
	});
	childProcess.on('exit', function (code) {
		callback(code);
	});
}

var packmanBootstrap = ['node_modules/packman/packman.js', '-c', 'build/at-bootstrap.yaml'];
var packmanRelease = ['node_modules/packman/packman.js', '-c', 'build/releases/standard/config.yaml'];

runCmd("node", packmanBootstrap, function(code) {
	runCmd("node", packmanRelease, function(code) {
		// done
	});
});