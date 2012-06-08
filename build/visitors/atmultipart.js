module.exports.onPackageStart = function(callback, config, packageFileObject) {
    packageFileObject.content += "//***MULTI-PART";
    callback();
};

module.exports.onFileStart = function(callback, config, packageFileObject) {
    packageFileObject.content += "\n//*******************\n";
    packageFileObject.content += "//LOGICAL-PATH:" + packageFileObject.currentFile.path + "\n"
    packageFileObject.content += "//*******************\n";
    callback();
};