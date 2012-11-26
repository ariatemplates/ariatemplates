/**
 * Version files with the MD5 hash of their content.
 * Calculate MD5 hash of a file and append it to the file name.
 */
module.exports = function(grunt) {

    var crypto = require('crypto');
    var util = require('util');
    var fs = require('fs');

    grunt.registerMultiTask('md5', 'Calculate md5 of a file and append to its name.', function() {
        var urlMap = grunt.config('config.urlMap');

        // src == dest: we do this in-place // perhaps to be made configurable some day...
        var srcFolder = grunt.config('dirs.dest');

        var toBeProcessed = grunt.helper('getFilesToBeProcessed', this.data.files, srcFolder);
        grunt.log.write([('MD5: ').cyan,
                            (toBeProcessed.length + ' files ').yellow,
                            ('to be processed... ').cyan].join(''));
        grunt.verbose.writeln('');

        toBeProcessed.forEach(function(srcFilePath) {
            md5file(srcFilePath, srcFolder, urlMap);
        });

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });

    /**
     * Calculates md5 of a file 'srcFilePath', and updated the entry in 'urlMap'.
     * 'srcFolder' is required to strip it in order to find entry in urlMap.
     * @param srcFilePath {String} disk location of a file to be processed, relative to Gruntfile
     * @param srcFolder {String} task source/target folder
     * @param urlMap {Object}
     */
    function md5file(srcFilePath, srcFolder, urlMap){
        var destFilePath = srcFilePath; // TODO perhaps make it configurable

        // calculate MD5 and rename file in-place
        grunt.verbose.write('Calculate MD5: ' + destFilePath + '... ');
        var destFilePathMd5ed = appendHashToFileName(srcFilePath, destFilePath);

        var pkgNameOrig = stripFolder(destFilePath, srcFolder);
        var pkgNameMd5ed = stripFolder(destFilePathMd5ed, srcFolder);

        grunt.verbose.write('Renaming to ' + destFilePathMd5ed.yellow + '...');
        fs.renameSync(destFilePath, destFilePathMd5ed);

        updatePathInUrlMapRecursive(urlMap, pkgNameOrig, pkgNameMd5ed);

        grunt.verbose.ok();
    }

    /**
     * MD5 hash the content of a file and return the new (versioned) file name based on a pattern.
     * @param {String} srcFilePath The original file path
     * @param {String} destFilePath The destination file path (will be altered by adding MD5)
     * @param {String} pattern The pattern to use to version the file name
     * @return {String} The new file name, located in the targetDir, and versioned with the MD5 hash
     */
    function appendHashToFileName(srcFilePath, destFilePath, pattern) {

        var targetDir = destFilePath.substring(0, destFilePath.lastIndexOf('/') + 1);
        var sourceDir = srcFilePath.substring(0, srcFilePath.lastIndexOf('/') + 1);

        var fileName = srcFilePath.substring(srcFilePath.lastIndexOf('/') + 1);
        var bareFileName = fileName.substring(0, fileName.lastIndexOf('.'));
        var extension = fileName.substring(fileName.lastIndexOf('.') + 1);

        targetDir = prepareTargetDirName(targetDir, sourceDir);
        pattern = pattern || '[name]-[md5].[extension]';

        var fileContent = grunt.file.read(srcFilePath);
        var md5 = hashContent(fileContent);

        return getNewFileName(targetDir, bareFileName, md5, extension, pattern);
    }
    function hashContent(content) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(content);
        return md5sum.digest('hex');
    }
    function getNewFileName(dir, fileName, md5, extension, pattern) {
        return dir + pattern.replace('[name]', fileName).replace('[md5]', md5).replace('[extension]', extension);
    }
    function prepareTargetDirName(targetDir, sourceDir) {
        targetDir = targetDir || sourceDir;
        if(targetDir !== '' && targetDir.substring(targetDir.length - 1) !== '/') {
            targetDir += '/';
        }
        return targetDir;
    }

    /**
     * Traverses the URL map and replaces all entries equal 'oldPath' to 'newPath'.
     * @param map {Object}
     * @param oldPath {String}
     * @param newPath {String}
     */
    function updatePathInUrlMapRecursive(map, oldPath, newPath) {
        if(!map) return;

        for(var k in map) {
            if(typeof map[k] === 'object') {
                updatePathInUrlMapRecursive(map[k], oldPath, newPath);
            } else if(typeof map[k] === 'string' && map[k] === oldPath) {
                map[k] = newPath;
            }
        }
    }

    /**
     * If 'path' starts with 'rootFolder', then strip it and return stripped path.
     * Returned value will never start with leading slash.
     * @param path {String}
     * @param rootFolder {String}
     * @return {String}
     */
    function stripFolder(path, rootFolder){
        if(startsWith(path, rootFolder)){
            path = path.slice(rootFolder.length);
        }
        if(startsWith(path, '/')){
            path = path.slice(1);
        }
        return path;
    }

    /**
     * Checks if 'str' starts with 'prefix'
     * @param str {String}
     * @param prefix {String}
     * @return {Boolean}
     */
    function startsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }
};
