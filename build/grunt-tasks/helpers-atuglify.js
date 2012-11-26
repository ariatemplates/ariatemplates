/**
 * Wrapper for grunt's 'uglify' task to add the possibility to split long lines.
 */
module.exports = function(grunt) {

    var uglifyjs = require('uglify-js');

    grunt.registerHelper('atuglify', function(src, options) {
        src = grunt.helper('uglify', src, options);
        src = grunt.helper('uglifySplitLines', src, options.max_line_length);
        return src;
    });

    grunt.registerHelper('uglifySplitLines', function(src, maxLineLength) {
        var pro = uglifyjs.uglify;
        return pro.split_lines(src, maxLineLength || 32 * 1024);
    });

};
