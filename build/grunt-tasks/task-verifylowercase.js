/**
 * Verifies that all the files in the input directory have lowercase extensions.
 */
module.exports = function(grunt) {

    grunt.registerMultiTask('verifylowercase', 'Verifies that all files have lowercase extensions', function() {
        var srcFolder = this.data.src;

        grunt.log.write('Verifying lowercase in file names... '.cyan);

        var files = grunt.file.expandFiles([srcFolder, '**/*'].join('/'));
        if(grunt.option('verbose')) {
            console.log(files);
        }
        files.forEach(function(filePath){
            filePath = filePath.replace('../', '');
            var idx = filePath.lastIndexOf('.');
            var ext = filePath.slice(idx);
            if(ext.toLowerCase() !== ext) {
                grunt.log.writeln(('\nThe file ' + filePath + ' has uppercase characters in the extension.').bold.red);
                grunt.warn('Lowercase extension checking failed.');
            }
        });

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });
};
