var AT = require('../../src/aria/node.js');

/**
 * Add default values for various skin properties, check consistency of the skin.
 */
module.exports = function(grunt) {

    grunt.registerMultiTask('normalizeskin', 'Add defaults and check consistency of the skin', function() {
        var done = this.async();
        var taskData = this.data;

        var srcFolder = grunt.config('dirs.src');
        var destFolder = grunt.config('dirs.dest');

        var srcFile = [srcFolder, this.file.src].join('/');
        var destFile = [destFolder, this.file.dest].join('/');

        grunt.log.write('Normalizing the skin as '.cyan + (destFile + '... ').yellow);
        var fileContent = grunt.file.read(srcFile);
        Aria.load({
            classes: ['aria.widgets.AriaSkinNormalization'],
            oncomplete: function(){
                finishNormalization(fileContent, destFile, srcFile, taskData, done);
            }
        });
    });

    function finishNormalization(fileContent, destFile, srcFile, taskData, done) {
        var out = processSkin(fileContent, taskData.options.minify);
        out = grunt.helper('minifyAndUpdateLicense', out, taskData);
        grunt.file.write(destFile, out);

        // Fail task if errors were logged.
        if (this.errorCount) { done(false); return; }
        // Otherwise, print a success message
        grunt.log.ok();
        done();
    }

    function processSkin (fileContent, minify) {
        var jsonIndent = minify ? '' : '    '; // 4 spaces
        var skinClasspath = 'aria.widgets.AriaSkin';

        if (fileContent.indexOf(skinClasspath) == -1) {
            return fileContent;
        }

        var skinClassDef = evalClassDefinition(fileContent);
        if (skinClassDef.$classpath != skinClasspath) {
            return fileContent;
        }

        var skinObject = skinClassDef.$prototype.skinObject;
        aria.widgets.AriaSkinNormalization.normalizeSkin(skinObject);
        return 'Aria.classDefinition(' + JSON.stringify(skinClassDef, null, jsonIndent) + ');';
    }

    function evalClassDefinition (fileContent) {
        var res = null;
        var Aria = {
            classDefinition: function(classDef) {
                res = classDef;
            }
        };
        eval(fileContent);
        return res;
    }

};
