var wrench = require('wrench');

module.exports.onStart = function(callback, config) {
	logger.logInfo("Copying all source files to " + config.destination + " first...");
	wrench.copyDirSyncRecursive(config.source, config.destination);
	callback();
};