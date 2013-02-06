module.exports = function(grunt) {

    var fs = require('fs');

    grunt.registerMultiTask('atmapreader', 'Read a map file', function() {
        grunt.log.write('Processing AT map... '.cyan);

        var urlMap = this.data.urlmap;
        var srcFolder = grunt.config.get('dirs.src');
        var packages = createPackageListFromMap(urlMap, srcFolder);

        // Adding targets for 'packager' task
        for(var pkgPath in packages) {
            //grunt.config.set(['packager','all','packages', pkgPath], packages[pkgPath]);
            grunt.config.set(['packager', pkgPath], packages[pkgPath]);
        }

        // Now, trimming the map from file extensions so that AT DownloadMgr can use it
        prepareDownloadMgrMap(urlMap);
        grunt.config.set('config.urlMap', urlMap);

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });

    function createPackageListFromMap(map, srcFolder, parent, packagesHolder, originalMap) {
        if(!packagesHolder) {
            packagesHolder = {};
        }

        for(var i in map) {
            if(typeof map[i] === 'object') {
                createPackageListFromMap(map[i], srcFolder, parent ? parent + '/' + i : i, packagesHolder, originalMap || map);
            } else {
                var packageName = map[i];
                if(!packagesHolder[packageName]) {
                    packagesHolder[packageName] = {files:[]};
                }

                if(i !== '*') {
                    packagesHolder[packageName].files.push(parent + '/' + i);
                } else {
                    // Wilcard means everything in the parent directory except things that are already going to another package!

                    var files = fs.readdirSync(srcFolder + '/' + parent).filter(function(item, i, array) {
                        var item = parent + '/' + item;
                        if(item.indexOf('.') !== -1 && !isFileDefinedInMap(item, originalMap)) {
                            array[i] = item;
                            return true;
                        } else {
                            return false;
                        }
                    });

                    // FIXME: why do we need to do this?? Look 6 lines above, should already be fine
                    for(var i = 0; i < files.length; i ++) {
                        if(files[i].indexOf(parent) === -1) {
                            files[i] = parent + '/' + files[i];
                        }
                    }

                    packagesHolder[packageName].files = packagesHolder[packageName].files.concat(files);
                }
            }
        }

        return packagesHolder;
    }

    function isFileDefinedInMap(filePath, map) {
        var parts = filePath.split('/');
        for(var i = 0; i < parts.length; i ++) {
            if(map[parts[i]] && typeof map[parts[i]] === 'string') {
                return true;
            } else if(map[parts[i]] && typeof map[parts[i]] === 'object') {
                map = map[parts[i]];
            } else {
                return false;
            }
        }
    }

    function prepareDownloadMgrMap(map) {
        for(var k in map) {
            if(typeof map[k] === 'object') {
                prepareDownloadMgrMap(map[k]);
            } else if(k.indexOf('.') !== -1) {
                map[k.substring(0, k.lastIndexOf('.'))] = map[k];
                delete map[k];
            }
        }
    }
};
