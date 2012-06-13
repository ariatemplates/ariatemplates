var fs = require("fs");

function getMap(config) {
	try {
		var mapFileName = config.urlmap;
		var mapFile = fs.readFileSync(mapFileName, "utf8");
		return JSON.parse(mapFile);
	} catch(e) {
		logger.logWarning("Could not retrieve the url map from the config " + e);
		return {};
	}
}

function isFileDefinedInMap(filePath, map) {
	var parts = filePath.split("/");
	for(var i = 0; i < parts.length; i ++) {
		if(map[parts[i]] && typeof map[parts[i]] === "string") {
			return true;
		} else if(map[parts[i]] && typeof map[parts[i]] === "object") {
			map = map[parts[i]];
		} else {
			return false;
		}
	}
}

function createPackageListFromMap(map, config, parent, packagesHolder, originalMap) {
	if(!packagesHolder) {
		packagesHolder = {};
	}

	for(var i in map) {
		if(typeof map[i] === "object") {
			createPackageListFromMap(map[i], config, parent ? parent + "/" + i : i, packagesHolder, originalMap || map);
		} else {
			var packageName = map[i];
			if(!packagesHolder[packageName]) {
				packagesHolder[packageName] = {files:[]};
			}

			if(i !== "*") {
				packagesHolder[packageName].files.push(parent + "/" + i);
			} else {
				// Wilcard means everything in the parent directory except things that are already going to another package!

				var files = fs.readdirSync(config.source + "/" + parent).filter(function(item, i, array) {
					var item = parent + "/" + item;
					if(item.indexOf(".") !== -1 && !isFileDefinedInMap(item, originalMap)) {
						array[i] = item;
						return true;
					} else {
						return false;
					}
				});

				// FIXME: why do we need to do this?? Look 6 lines above, should already be fine
				for(var i = 0; i < files.length; i ++) {
					if(files[i].indexOf(parent) === -1) {
						files[i] = parent + "/" + files[i];
					}
				}

				packagesHolder[packageName].files = packagesHolder[packageName].files.concat(files);
			}
		}
	}

	return packagesHolder;
}

function prepareDownloadMgrMap(map) {
	for(var i in map) {
		if(typeof map[i] === "object") {
			prepareDownloadMgrMap(map[i]);
		} else if(i.indexOf(".") !== -1) {
			map[i.substring(0, i.indexOf("."))] = map[i];
			delete map[i];
		}
	}
}

module.exports.onAfterConfigLoaded = function(callback, config) {
	var map = getMap(config);
	var packages = createPackageListFromMap(map, config);

	// Writing the new packages to the global config so that packman knows what to do
	for(var i in packages) {
		config.packages[i] = packages[i];
	}

	// Now, triming the map from file extensions so that AT DownloadMgr can use it
	prepareDownloadMgrMap(map);
	config.urlmap = map;

	callback();
};
