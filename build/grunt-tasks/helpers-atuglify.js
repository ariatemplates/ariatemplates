/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

/*
 * The code is Grunt 0.3.17 'uglify' helper code with small Aria Templates overrides.
 */
module.exports = function (grunt) {

    // External libs.
    var uglifyjs = require('uglify-js');

    // Minify with UglifyJS.
    // From https://github.com/mishoo/UglifyJS
    grunt.registerHelper('atuglify', function (src, options) {
        if (!options) {
            options = {};
        }
        var jsp = uglifyjs.parser;
        var pro = uglifyjs.uglify;
        var ast, pos;
        var msg = 'Minifying with UglifyJS...';

        grunt.verbose.write(msg);
        try {
            ast = jsp.parse(src);

            // == ARIA TEMPLATES OVERRIDE START: unnecessary code removal ==
            ast = grunt.helper('removeUnnecessaryCode', ast);
            // == ARIA TEMPLATES OVERRIDE END ==

            ast = pro.ast_mangle(ast, options.mangle || {});
            ast = pro.ast_squeeze(ast, options.squeeze || {});
            src = pro.gen_code(ast, options.codegen || {});

            // == ARIA TEMPLATES OVERRIDE START: split long lines ==
            src = grunt.helper('uglifySplitLines', src, options.max_line_length);
            // == ARIA TEMPLATES OVERRIDE END ==

            // Success!
            grunt.verbose.ok();
            // UglifyJS adds a trailing semicolon only when run as a binary.
            // So we manually add the trailing semicolon when using it as a module.
            // https://github.com/mishoo/UglifyJS/issues/126
            return src + ';';
        } catch (e) {
            // Something went wrong.
            grunt.verbose.or.write(msg);
            pos = '['.red + ('L' + e.line).yellow + ':'.red + ('C' + e.col).yellow + ']'.red;
            grunt.log.error().writeln(pos + ' ' + (e.message + ' (position: ' + e.pos + ')').yellow);
            grunt.warn('UglifyJS found errors.', 10);
        }
    });

    /**
     * Try to split long lines so they have at most `maxLineLength` chars. Wrapper for Uglify's internal methods. Note:
     * This helper is also used to split URLMap, do not remove it.
     */
    grunt.registerHelper('uglifySplitLines', function (src, maxLineLength) {
        var pro = uglifyjs.uglify;
        return pro.split_lines(src, maxLineLength || 32 * 1024);
    });

};
