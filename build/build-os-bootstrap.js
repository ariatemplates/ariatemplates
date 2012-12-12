/**
 * Aria Templates opensource bootstrap build file.
 *
 * This is a very minimalistic build. The main thing it does is to create a file
 * 'aria-templates-x.y.z.js' as a concatenation of the framework's most essential files.
 *
 * The x.y.z stands for current release version that is read from JSON config file. It also:
 * - updates license headers in all the files accordingly,
 * - renames skin file to include the version in the name.
 *
 * ! This build is dependency of a more robust 'build-os-prod' production build.
 */

/* ************************************************************************* */
/*
 * Setting some variables in the global scope
 * for simplicity of use in later stage of the file.
 */
var minifyNOlicenseYES = {
    license : 'replace',
    minify : false
};

var taskDirs = {
    src: '../src',
    dest: 'target/os-bootstrap'
};

module.exports = function(grunt) {

    grunt.loadTasks('grunt-tasks');
    grunt.initConfig({

        // ===============================================================
        //                              CONFIG
        // ===============================================================

        /**
         * NPM file to read the current version of the product etc.
         */
        pkg: '<json:../package.json>',

        /**
         * Dirs to be used by default by tasks.
         * Some tasks may override it in per-task config.
         */
        dirs: {
            src: taskDirs.src,
            dest: taskDirs.dest
        },

        // ===============================================================
        //                             REAL TASKS
        // ===============================================================

        normalizeskin : {
            atskin : {
                src: 'aria/css/atskin.js',
                dest: 'aria/css/atskin-<%= pkg.version %>.js',
                options: minifyNOlicenseYES
            }
        },

        simplepackager: {
            bootstrap: {
                src: '<json:./config/files-bootstrap.json>',
                dest: 'aria/ariatemplates-<%= pkg.version %>.js',
                writeAriaVersion: true,
                options: minifyNOlicenseYES
            }
        },

        copy: {
            binaryFiles: {
                files: {
                    include: [
                        'aria/css/atskin/**/*',
                        'aria/resources/handlers/IO.swf'
                    ]
                }
            },
            remaining: {
                files: {
                    include: ['**/*'],
                    exclude: [
                        'aria/node.js',      // not suited to use in prod
                        'aria/bootstrap.js', // not suited to use in prod
                        '<config:normalizeskin.atskin.src>',
                        '<config:simplepackager.bootstrap.src>',
                        '<config:copy.binaryFiles.files.include>'
                    ]
                },
                options: minifyNOlicenseYES
            }
        },

        /**
         * Remove folders and their contents, recursively.
         * To be used as pre-build and/or post-build cleanup.
         */
        removedirs : {
            bootstrap : {
                folders : [
                    taskDirs.dest
                ]
            }
        }
    });

    grunt.registerTask('doBuild', 'normalizeskin simplepackager copy:binaryFiles copy:remaining');
    grunt.registerTask('release', 'removedirs doBuild');

    grunt.registerTask('default', 'release');
};
