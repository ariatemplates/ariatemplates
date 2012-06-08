// adds the urlMap at the end of the bootstrap file


function hasATLoaderVisitor(packageConfig) {
	var hasIt = false;
	if(!!packageConfig.visitors) {
		packageConfig.visitors.forEach(function(value, index, array) {
			if(value.indexOf("atloader.js") !== -1) {
				hasIt = true;
			}
		});
	}
	return hasIt;
};

function isATLoaderPackage(config, packageFileObject) {
	var isLoader = false;
	Object.keys(config.packages).forEach(function(value, index, packages) {
		var packageConfig = config.packages[value];
		if(hasATLoaderVisitor(packageConfig) && packageFileObject.path === value) {
			isLoader = true;
		}
	});
	return isLoader;
};

module.exports.onPackageEnd = function(callback, config, packageFileObject) {
	if(isATLoaderPackage(config, packageFileObject)) {
		// generate the map at the end
		//console.log(config.resolvedPackages)
	}
	callback();
};