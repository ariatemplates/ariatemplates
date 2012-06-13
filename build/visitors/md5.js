/**
 * Version files with the MD5 hash of their content.
 * This is an interesting website static resources versioning strategy as it allows setting far future cache expiry headers
 * and therefore make sure resources are kept in the cache memory of the browser for as long as the content doesn't change.
 * Even across 2 different versions of an application, certain files may have not changed, and therefore their file name won't
 * change, therefore still being fetched from the browser cache.
 */

var crypto = require("crypto");
var util = require("util");


function hashContent(content) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(content);
    return md5sum.digest('hex');
};

function getNewFileName(dir, fileName, md5, extension, pattern) {
    return dir + pattern.replace("[name]", fileName).replace("[md5]", md5).replace("[extension]", extension);
};

function prepareTargetDirName(targetDir, sourceDir) {
    targetDir = targetDir || sourceDir;
    if(targetDir !== "" && targetDir.substring(targetDir.length - 1) !== "/") {
        targetDir += "/";
    }
    return targetDir;
};

/**
 * MD5 hash the content of a file and return the new (versioned) file name based on a pattern.
 * @param {String} filePath The original file path
 * @param {String} content The content of the file
 * @param {String} targetDir The target directory where the file is supposed to go
 * @param {String} pattern The pattern to use to version the file name
 * @return {String} The new file name, located in the targetDir, and versioned with the MD5 hash
 */
function getVersionedFileName(filePath, content, targetDir, pattern) {
    var sourceDir = filePath.substring(0, filePath.lastIndexOf("/") + 1);
    var fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
    var bareFileName = fileName.substring(0, fileName.lastIndexOf("."));
    var extension = fileName.substring(fileName.lastIndexOf(".") + 1);

    targetDir = prepareTargetDirName(targetDir, sourceDir);
    pattern = pattern || "[name]-[md5].[extension]";

    var md5 = hashContent(content);

    return getNewFileName(targetDir, bareFileName, md5, extension, pattern);
};

function updatePathInUrlMap(map, oldPath, newPath) {
    if(map) {
        for(var i in map) {
            if(typeof map[i] === "object") {
                updatePathInUrlMap(map[i], oldPath, newPath);
            } else if(typeof map[i] === "string" && map[i] === oldPath) {
                map[i] = newPath;
            }
        }
    }
};

module.exports.onPackageEnd = function(callback, config, packageFileObject) {
    var newPath = getVersionedFileName(packageFileObject.path, packageFileObject.content);
    updatePathInUrlMap(config.urlmap, packageFileObject.path, newPath);
    packageFileObject.path = newPath;
    callback();
};