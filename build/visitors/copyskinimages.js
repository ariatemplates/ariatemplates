var wrench = require("wrench");

module.exports.onPackageStart = function(callback, config, packageFileObject) {
    var skinFilePath = packageFileObject.path;
    var imgFolderPath = skinFilePath.substring(0, skinFilePath.lastIndexOf("."));

    logger.logInfo("Copying all images from " + config.source + "/" + imgFolderPath + " to " + config.destination + "/" + imgFolderPath);

    wrench.mkdirSyncRecursive(config.destination + "/" + imgFolderPath, 0777);
    wrench.copyDirSyncRecursive(config.source + "/" + imgFolderPath, config.destination + "/" + imgFolderPath);

    callback();
};