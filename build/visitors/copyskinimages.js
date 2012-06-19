var wrench = require("wrench");

module.exports.onPackageStart = function(callback, config, packageFileObject) {
    var skinFilePath = packageFileObject.path;
    var imgFolderPath = skinFilePath.substring(0, skinFilePath.lastIndexOf("."));
    wrench.copyDirSyncRecursive(config.source + "/" + imgFolderPath, config.destination + "/" + imgFolderPath);
    callback();
};