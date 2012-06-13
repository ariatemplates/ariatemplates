module.exports.onFileStart = function(callback, config, packageFileObject) {
    packageFileObject.content += "\n";
    callback();
};