var counter = {};

module.exports.onFileContent = function(callback, config, fileObject) {
	var lines = fileObject.content.split("\n").length;

	if(!counter[fileObject.packageFile.path]) {
		counter[fileObject.packageFile.path] = 0
	}

	counter[fileObject.packageFile.path] += lines;
	fileObject.content = "";
	fileObject.packageFile.content += fileObject.path + "\t" + lines + "\t" + counter[fileObject.packageFile.path] + "\n";

    callback();
};