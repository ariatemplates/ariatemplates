// This visitor adds the copyright header at the top of all packages, and removes it from the top of all source files

var fs = require("fs");

var licenseHeaderText = fs.readFileSync(process.cwd() + "/licensefileheader.js", "utf8");

var validExtensions = [
	".js",
	".tpl",
	".tpl.css",
	".tml",
	".tpl.txt"
];

function isValidFile(fileName) {
	for(var i = 0; i < validExtensions.length; i ++) {
		if(fileName.substring(fileName.length - validExtensions[i].length) === validExtensions[i]) {
			return true;
		}
	}
	return false;
}

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
