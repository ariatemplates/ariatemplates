/**
 * Aria Templates opensource production build file.
 *
 * ! This build depends on the 'build-os-bootstrap' to execute properly.
 *
 * This build does the following things:
 * - creates packages from multiple input files,
 * - minifies JavaScript,
 * - adds a header in each package with license and current release version,
 * - append MD5 checksum to each file name as a way to make files cacheable for longer periods.
 */

/* ************************************************************************* */
/*
 * IMPORTANT NOTE:
 *  When renaming a task or a target, make sure to update the references to it
 *  from within other tasks. Use 'find all & replace' for that.
 */

/*
 * Setting some variables in the global scope
 * for simplicity of use in later stage of the file.
 */
var taskDirs = {
    bootstrap : 'target/os-bootstrap',
    prodTmp : 'target/os-production-tmp',
    prod : 'target/os-production'
};

var minifyYESlicenseYES = {
    minify : true,
    license : 'replace'
};
var minifyYESlicenseNO = {
    minify : true,
    license : 'remove'
};
var minifyNOlicenseNO = {
    minify : false,
    license : 'remove'
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
        pkg : '<json:../package.json>',

        /**
         * Dirs to be used by default by tasks.
         * Some tasks may override it in per-task config.
         */
        dirs : {
            src : taskDirs.bootstrap,
            tmp : taskDirs.prodTmp,
            dest : taskDirs.prod
        },

        /**
         * UglifyJS options. Note that we use custom wrapper for GruntJS uglify helper,
         * hence the possible options are severely limited.
         */
        uglify : {
            max_line_length : 512,
            codegen : {
                ascii_only : true // needed to preserve \u1234, otherwise rubbish gets out
            }
        },

        // ===============================================================
        //                             REAL TASKS
        // ===============================================================

        /**
         * Copy files; uglify if JS; strip/update license accordingly.
         */
        copy : {
            /*
             * Files below will be copied directly to 'prod' folder, omitting the 'tmp'
             */
            atMainAndSkinJs : {
                files : {
                    include : [
                        'aria/ariatemplates-<%= pkg.version %>.js',
                        'aria/css/atskin-<%= pkg.version %>.js'
                    ]
                },
                options : minifyYESlicenseYES,
                destFolder : taskDirs.prod
            },

            binaryFiles : {
                files : {
                    include : [
                        'aria/css/atskin/**/*',
                        'aria/resources/handlers/IO.swf'
                    ]
                },
                options : minifyNOlicenseNO,
                destFolder : taskDirs.prod
            },

            /*
             * Files below will be copied to 'tmp' folder, to undergo further processing (packaging)
             */
            remainingJs : {
                files : {
                    include : ['**/*.js'], // uglify the JS files
                    exclude : [
                        '<config:copy.atMainAndSkinJs.files.include>'
                    ]
                },
                options : minifyYESlicenseNO, // they will be packaged; no need for license for each file
                destFolder : taskDirs.prodTmp
            },
            remainingNonJs : {
                files : {
                    include : ['**/*'], // don't uglify non-JS files, e.g. TPLs
                    exclude : [
                        '<config:copy.atMainAndSkinJs.files.include>',
                        '<config:copy.remainingJs.files.include>',
                        '<config:copy.binaryFiles.files.include>'
                    ]
                },
                options : minifyNOlicenseNO,
                destFolder : taskDirs.prodTmp
            }
        },

        /**
         * Reads AT file map and stores the JSON in globally accessible property.
         * Creates targets for 'packager' task.
         */
        atmapreader : {
            singletask : {
                urlmap : '<json:./config/urlmap.json>'
            }
        },

        /**
         * Targets for this task will be created by 'atmapreader' task.
         * Each output file will be a separate target object, containing input files.
         *
         * Because of this, we can't set src|destFolders here, so they're read
         * inside the task as config.get('dirs.tmp') / config.get('dirs.dest').
         * @dependsOn atmapreader
         */
        packager : {
        },

        /**
         * Verifies that 'packager' done its job well (that all the files belong to some package).
         * @dependsOn packager
         */
        verifypackager : {
            ignored : [
                'aria/node.js',
                'aria/bootstrap.js',
                'README.md'
            ]
        },

        /**
         * Calculate md5 and rename files in-place. Executed on 'dirs.prod'
         */
        md5 : {
            singletask : {
                files : {
                    include : [
                        '**/*.js',
                        '**/*.html',
                        '**/*.txt'
                    ],
                    exclude : [
                        'aria/css/atskin-<%= pkg.version %>.js',
                        'aria/ariatemplates-<%= pkg.version %>.js'
                    ]
                }
            }
        },

        /**
         * Appends URL map loaded by 'atmapreader' to certain files.
         * The URL map might be modified by 'md5' task by appending md5s to package names.
         * @dependsOn atmapreader
         */
        atmapwriter : {
            singletask : {
                files : {
                    include : [
                        'aria/ariatemplates-<%= pkg.version %>.js'
                    ]
                }
            }
        },

        /**
         * Remove folders and their contents, recursively.
         * To be used as pre-build and/or post-build cleanup.
         */
        removedirs : {
            tmp : {
                folders : [
                    taskDirs.prodTmp
                ]
            },
            prod : {
                folders : [
                    taskDirs.prod
                ]
            }
        },

        /**
         * Measure package files sizes before and after the gzipping.
         */
        gzipStats : {
            prod : {
                src : taskDirs.prod
            }
        }
    });

    grunt.registerTask('postCleanup', 'removedirs:tmp');
    grunt.registerTask('copyTmp', 'copy:remainingJs copy:remainingNonJs');
    grunt.registerTask('copyProd', 'copy:atMainAndSkinJs copy:binaryFiles');

    grunt.registerTask('buildTmp', 'removedirs:tmp copyTmp');
    grunt.registerTask('buildProdFromTmp', 'removedirs:prod copyProd atmapreader packager verifypackager md5 atmapwriter');
    grunt.registerTask('buildProdFromTmpNoVersion', 'removedirs:prod copyProd atmapreader packager verifypackager atmapwriter');
    grunt.registerTask('release', 'buildTmp buildProdFromTmp');
    grunt.registerTask('releaseAndStats', 'release gzipStats');
    grunt.registerTask('releaseAndClean', 'release postCleanup');
    grunt.registerTask('releaseAndCleanNoVersion', 'buildTmp buildProdFromTmpNoVersion postCleanup');
    grunt.registerTask('releaseAndStatsAndClean', 'release gzipStats postCleanup');

    //grunt.registerTask('default', 'buildProdFromTmp'); // for debugging
    //grunt.registerTask('default', 'gzipStats');        // for debugging
    //grunt.registerTask('default', 'releaseAndStats');  // for debugging
    grunt.registerTask('default', 'releaseAndStatsAndClean');
};
