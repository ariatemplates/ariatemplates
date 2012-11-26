/**
 * Verifies that all the source files were included in at least one package
 * by the 'packager' task.
 */
module.exports = function(grunt) {

    grunt.registerTask('verifypackager', 'Verifies that all the files were packaged', function() {

        var srcFolder = grunt.config.get('dirs.tmp') + '/';
        var ignoredFiles = grunt.config.get([this.name, 'ignored']);

        grunt.log.write('Verifying the packaging... '.cyan);

        var allFilesTmp = grunt.file.expandFiles(srcFolder + '**/*');
        var allFiles = allFilesTmp.map(function(val){
            return val.replace(srcFolder, '');
        });

        var visitedTmp = grunt.config.get('visitedFiles.packager'); // key: filePath, value: packagedInto
        var visited = Object.keys(visitedTmp);

        if(grunt.option('verbose')) {
            grunt.verbose.writeln('All files from src folder: '.cyan + (allFiles.length).yellow);
            console.log(allFiles);

            grunt.verbose.writeln('Visited files: '.cyan + (visited.length).yellow);
            console.log(visited);

            grunt.verbose.writeln('Ignored files: '.cyan + (ignoredFiles.length).yellow);
            console.log(ignoredFiles);
        }

        var us = grunt.utils._;
        var diff = us.difference(allFiles, us.union(visited, ignoredFiles));

        if(diff.length > 0) {
            var msg = '\nWarning: the following ' + diff.length + ' files were not included in any package:';
            grunt.log.writeln(msg.bold.red);
            console.log(diff);
            grunt.log.writeln('Not doing anything with it. Continuing despite this warning.'.bold.red);
        }

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });
};
