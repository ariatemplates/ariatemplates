/**
 * Display file sizes of minified packages and gzipped packages.
 */
module.exports = function(grunt) {

    var gzip = require('gzip-js');
    var fs = require('fs');

    grunt.registerMultiTask('gzipStats', 'GZips the files and displays stats', function() {
        var srcFolder = this.data.src;
        grunt.log.writeln('Calculating GZip stats for the folder: '.cyan + srcFolder.yellow);

        var files = grunt.file.expandFiles([srcFolder, '**/*.js'].join('/'));
        grunt.log.writeln('\n      min      gzip   gain  file');
        grunt.log.writeln('--------------------------------------------------------------------------------');

        var sizeTotal = 0, sizeGzipTotal = 0;
        files.forEach(function(filePath){
            var sizeKbOrig = (fs.statSync(filePath).size / 1024);
            var gzipped = grunt.helper('gzip', grunt.file.read(filePath));
            var sizeKbGzip = (gzipped.length / 1024);

            var filePathShort = filePath.replace(srcFolder, '');
            grunt.log.writeln(size(sizeKbOrig) + size(sizeKbGzip) + gain(sizeKbOrig, sizeKbGzip) + filePathShort);
            sizeTotal += sizeKbOrig;
            sizeGzipTotal += sizeKbGzip;
        });
        grunt.log.writeln('--------------------------------------------------------------------------------');
        grunt.log.writeln(size(sizeTotal) + size(sizeGzipTotal) + gain(sizeTotal, sizeGzipTotal));

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });

    // Return gzipped source.
    grunt.registerHelper('gzip', function(src) {
        return src ? gzip.zip(src, {}) : '';
    });

    /**
     * @param {Float} sizeKb
     */
    function size(sizeKb) {
        sizeKb = sizeKb.toFixed(1) ; // should have length 3..5 (e.g. '186.0' or '7.3')
        var prependLen = 6 - sizeKb.length;
        return (new Array(prependLen+1).join(' ')) + sizeKb + ' kB ';
    }

    /**
     * @param {Float} sizeKbOrig
     * @param {Float} sizeKbGzip
     */
    function gain(sizeKbOrig, sizeKbGzip){
        var gain = ((1 - (sizeKbGzip / sizeKbOrig)) * 100).toFixed(0);
        var prependLen = 5 - gain.length;
        return (new Array(prependLen+1).join(' ')) + gain + '%  ';
    }

};
