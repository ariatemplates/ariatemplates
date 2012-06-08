module.exports.onFileEnd = function(callback, config, packageFileObject) {
	packageFileObject.content += "\n\naria.core.DownloadMgr.updateUrlMap(" + JSON.stringify(config.urlmap) + ");";
	callback();
};