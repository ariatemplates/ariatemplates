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
		// TODO: When packman issue 7 will be implemented, we will have real exit codes to deal with failing packages
		// https://github.com/captainbrosset/packman/issues/7
		if(code === 1) {
			process.exit(1);
		} else {
			callback(code);
		}
	});
}

var packmanBootstrap = ['node_modules/packman/packman.js', '-c', 'build/at-bootstrap.yaml', '-n'];
var packmanRelease = ['node_modules/packman/packman.js', '-c', 'build/releases/standard/config.yaml', '-n'];

runCmd("node", packmanBootstrap, function(code) {
	runCmd("node", packmanRelease, function(code) {});
});