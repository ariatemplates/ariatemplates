/**
 * Simply concatenate several files.
 * Able also to minify, update license and to write AT version in the placeholder.
 */
module.exports = function(grunt) {

    grunt.registerMultiTask('simplepackager', 'Package several files all together', function() {

        var srcFolder = grunt.config('dirs.src');
        var destFolder = grunt.config('dirs.dest');
        var destFile = [destFolder, this.file.dest].join('/');

        // magic string to look for in the source and replace with the current version
        var versionPlaceholder = 'ARIA-SNAPSHOT';

        var inputFiles = grunt.helper('expandWildcards', this.file.src, srcFolder); // expand * and **, if any
        var noOfFiles = inputFiles.length;

        grunt.log.write([('Simple packager: ').cyan,
                         (noOfFiles + ' ' + grunt.utils.pluralize(noOfFiles, 'file/files')).yellow,
                         (' to be packaged as ').cyan,
                         (destFile + '... ').yellow].join(''));

        var separatorText = grunt.helper('getSeparatorText', this.data);
        var out = grunt.helper('concat', inputFiles, {separator: separatorText});
        if(this.data.writeAriaVersion) {
            out = out.replace(versionPlaceholder, grunt.config.get('pkg.version'));
        }
        out = grunt.helper('minifyAndUpdateLicense', out, this.data);

        grunt.file.write(destFile, out);

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });

};
