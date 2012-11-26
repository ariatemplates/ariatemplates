/**
 * Main Aria Templates grunt entry point.
 *
 * Note : this file was deliberately named 'gruntfile.js' instead of 'grunt.js'
 * to avoid Windows-specific problem where the command 'grunt' has a precedence
 * to try to open 'grunt.js' instead of invoking globally installed grunt binary.
 *
 * To run this file, type in the console : grunt --config gruntfile.js
 */

module.exports = function(grunt) {

    grunt.loadTasks('./build/grunt-tasks');

    var jsHintConf      = require('./build/config/jshint.json');
    var jsHintConfBuild = require('./build/config/jshint-build.json');
    jsHintConfBuild = grunt.utils._.extend(jsHintConf, jsHintConfBuild);

    grunt.initConfig({

        // ===============================================================
        //                              CONFIG
        // ===============================================================

        /**
         * NPM file to read the current version of the product etc.
         */
        pkg : '<json:package.json>',

        /**
         * Options for Grunt's original JSHint wrapper.
         */
        jshint : {
            options : jsHintConf,
            build : { // the target 'atlint:build' has overridden set of options
                options : jsHintConfBuild
            }
        },

        /**
         * Options for our overrides of Grunt's JSHint wrapper.
         */
        jshintOverride : {
            ignoredMessages : [
                "Confusing use of '!'",   // https://github.com/jshint/jshint/issues/455
                "Unexpected space after", // JSHint 0.9.0 -> 0.9.1; see https://github.com/jshint/jshint/issues/667 666 655
                "to have an indentation"  // JSHint 0.9.0 -> 0.9.1; see https://github.com/jshint/jshint/issues/667 666 655
            ]
        },

        // ===============================================================
        //                             REAL TASKS
        // ===============================================================

        /**
         * Targets for linting with JSHint. This is a custom wrapper to handle
         * excluded files, and then invoke the 'lint' task.
         */
        atlint : {
            source : {
                include : ['src/aria/**/*.js'],
                exclude : [
                    // Resources : dependent on https://github.com/jshint/jshint/issues/494
                    'src/aria/resources/CalendarRes*.js',
                    'src/aria/resources/DateRes*.js',
                    'src/aria/resources/multiselect/FooterRes*.js',
                    // SynEvents : dependent on https://github.com/ariatemplates/ariatemplates/issues/33
                    'src/aria/utils/SynEvents.js',
                    // Using node.js globals
                    'src/aria/node.js'
                ]
            },
            build : {
                include : [
                    'src/aria/node.js',
                    'grunt.js',
                    'build/build*.js',
                    'build/grunt-tasks/*.js'
                ]
            }
        },

        /**
         * Run a child Grunt build.
         */
        forkgrunt : {
            osbootstrap : './build/build-os-bootstrap.js',
            osprod      : './build/build-os-prod.js'
        }
    });

    // tasks for debugging
    grunt.registerTask('osBootstrapOnly',    'forkgrunt:osbootstrap');
    grunt.registerTask('osProdOnly',         'forkgrunt:osprod');
    grunt.registerTask('releaseOsBootstrap', 'atlint:source forkgrunt:osbootstrap');
    grunt.registerTask('releaseOsProd',      'atlint:source forkgrunt:osprod');

    // tasks for real build
    grunt.registerTask('release', 'atlint:source forkgrunt:osbootstrap forkgrunt:osprod');

    // include time measurements
    grunt.registerTask('default', 'gruntTimeHookStart release gruntTimeHookEnd');

};
