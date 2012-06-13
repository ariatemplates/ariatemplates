// This visitor versions whatever package is configured with it according to the version specified in the npm package.json file

var fs = require("fs");

function getVersionedPath(path, version) {
	var extPosition = path.lastIndexOf(".");
	return path.substring(0, extPosition) + "-" + version + path.substring(extPosition);
};

module.exports.onPackageEnd = function(callback, config, packageFileObject) {
    // Get the package.json file which should be at the root of the project
    var npmFile = fs.readFileSync(process.cwd() + "/package.json", "utf8");
    var npmConfig = JSON.parse(npmFile);

    packageFileObject.path = getVersionedPath(packageFileObject.path, npmConfig.version);

    callback();
};