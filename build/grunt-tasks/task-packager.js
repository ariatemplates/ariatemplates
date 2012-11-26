/**
 * File packager. Concatenates input files into a single output file.
 * Capable of creating Aria Templates multipart files.
 */
module.exports = function(grunt) {

    grunt.registerMultiTask('packager', 'Multipart-aware packager', function() {

        var srcFolder = grunt.config.get('dirs.tmp') + '/';
        var destFolder = grunt.config.get('dirs.dest') + '/';

        var inputFiles = this.data.files; // e.g. ['aria/DomEvent.js', ...]
        var outputFilePath = this.target; // e.g. 'aria/pack-utils.js'

        var bAppendLicense = checkIfAppendLicense(outputFilePath);
        var bAppendMultipart = checkIfAppendMultipartSignatures(inputFiles);

        grunt.log.write([
                            ('Packager: ').cyan,
                            (inputFiles.length + ' ' + grunt.utils.pluralize(inputFiles.length, 'file/files')).yellow,
                            (' to be packaged as ').cyan,
                            (outputFilePath + '... ').yellow
                        ].join(''));
        if(grunt.option('verbose')){
            grunt.verbose.writeln('Included files:');
            console.log(inputFiles);
        }
        grunt.helper('markFilesAsVisited', inputFiles, this.name, this.target);

        var out = '';
        if(bAppendLicense) { // output the preprocessed license text
            out += grunt.helper('getLicenseTextLazy');
        }
        if(bAppendMultipart) {
            out += '//***MULTI-PART';
        }

        // output the contents of all the files
        inputFiles.forEach(function(filePath){
            out += processFile(filePath, srcFolder, bAppendMultipart);
        });

        // save the package file
        grunt.file.write(destFolder + outputFilePath, out);

        // Fail task if errors were logged.
        if (this.errorCount) { return false; }
        // Otherwise, print a success message
        grunt.log.ok();
    });

    /**
     * Read file 'filePath' from 'srcFolder' and return the contents.
     * If 'bAppendMultipart' is true, then prepend it with appropriate multipart header.
     * @param filePath {String}
     * @param srcFolder {String}
     * @param bAppendMultipart {Boolean}
     * @return {String}
     */
    function processFile(filePath, srcFolder, bAppendMultipart) {
        var multipartBoundary = '*******************';
        var out = '';
        // grunt.verbose.writeln('|- ' + filePath); // auto-logged by grunt in verbose

        if(bAppendMultipart) {
            out += '\n//' + multipartBoundary;
            out += '\n//LOGICAL-PATH:' + filePath;
            out += '\n//' + multipartBoundary + '\n';
        } else {
            // out += '\n'; // if it's only 1 input file, then adding newline doesn't make sense.
        }

        var fileContent = grunt.file.read(srcFolder + filePath);
        out += fileContent;
        return out;
    }

    /**
     * Prevent appending license header to packages with names *.TXT *.HTM *.HTML or without extension.
     * Perhaps to be changed in the future.
     * @param outputFilePath {String}
     * @return {Boolean}
     */
    function checkIfAppendLicense(outputFilePath) {
        var idx = outputFilePath.lastIndexOf('.');
        if(idx === -1){
            return false;
        }
        var ext = outputFilePath.toLowerCase().slice(idx + 1);
        switch(ext){
            case 'txt':
            case 'htm':
            case 'html':
                return false;
            default:
                return true;
        }
    }

    /**
     * For now, don't output as multipart if there's only 1 input file.
     * Perhaps to be changed in the future.
     * @param inputFiles {Array<String>}
     * @return {Boolean}
     */
    function checkIfAppendMultipartSignatures(inputFiles) {
        return (inputFiles.length > 1);
    }
};
