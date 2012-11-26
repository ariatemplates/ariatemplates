/**
 * Copies files between two dirs. Capable of doing JS minification and adding license banner.
 */
module.exports = function(grunt) {

    grunt.registerMultiTask('copy', 'Copy files from one place to another', function() {

        var conf = this.data.options || {};
        var destFolder = grunt.helper('getTaskDestFolder', this.data);
        var srcFolder = grunt.helper('getTaskSrcFolder', this.data);
        var files = [];

        var toBeCopied = grunt.helper('getFilesToBeProcessed', this.data.files, srcFolder);
        var filesCount = toBeCopied.length;
        var logMsg = [('Copy: ').cyan,
                      (filesCount + ' ' + grunt.utils.pluralize(filesCount, 'file/files')).yellow,
                      (' to be ' + (conf.minify ? 'minified and ' : '') + 'copied to ').cyan,
                      (destFolder + '... ').yellow].join('');
        grunt.log.write(logMsg);

        var copyOptions = grunt.helper('getCopyOptions', conf);
        toBeCopied.forEach(function(srcFile) {
            var destFile = destFolder + srcFile.substr(srcFolder.length);
            // grunt.verbose.writeln('Copying '+srcFile.cyan+' ...');  // auto-logged by grunt in verbose
            grunt.file.copy(srcFile, destFile, copyOptions);
            grunt.verbose.ok();
        });

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });
};
