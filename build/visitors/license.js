// This visitor adds the copyright header at the top of all packages, and removes it from the top of all source files

var fs = require("fs");
var isValidFile = require('./atfileextensions.js');
var licenseHeaderText = fs.readFileSync("./build/visitors/licensefileheader.js", "utf8");

function hasCopyright(content) {
	return content.indexOf(licenseHeaderText) !== -1;
}

module.exports.onPackageStart = function(callback, config, packageFileObject) {
	packageFileObject.content = licenseHeaderText;
	callback();
};

module.exports.onFileContent = function(callback, config, fileObject) {
	if(isValidFile(fileObject.path) && hasCopyright(fileObject.content)) {
		var lines = fileObject.content.split("\n");
		var headerHeight = licenseHeaderText.split("\n").length - 1;
		lines.splice(0, headerHeight);
		fileObject.content = lines.join("\n");
	}

    callback();
};
