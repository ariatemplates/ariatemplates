module.exports = function(grunt) {

    var fs = require('fs');

    grunt.registerMultiTask('atmapwriter', 'Append map file to ariatemplates-x.y.z.js', function() {
        var urlMapJson = grunt.config('config.urlMap');
        if (grunt.option('verbose')){
            grunt.verbose.writeln('URL map:');
            console.log(urlMapJson); // console has nicer output that grunt's log
        }

        var srcFolder = grunt.config('dirs.dest');
        var toBeProcessed = grunt.helper('getFilesToBeProcessed', this.data.files, srcFolder);

        var lineMaxLen = grunt.config('uglify.max_line_length');
        var lf = grunt.utils.linefeed;

        grunt.verbose.write('Minifying the URL map... ');
        var urlMapString = 'aria.core.DownloadMgr.updateUrlMap(' + JSON.stringify(urlMapJson) + ');'
        urlMapString = grunt.helper('uglifySplitLines', urlMapString, lineMaxLen);
        grunt.verbose.ok();

        toBeProcessed.forEach(function(srcFilePath) {
            grunt.log.write('Appending URL map to '.cyan + (srcFilePath + '... ').yellow);
            var fd = fs.openSync(srcFilePath, 'a');
            fs.writeSync(fd, lf + urlMapString + lf);
        });

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });
};
