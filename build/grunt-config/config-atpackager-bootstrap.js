/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Aria Templates opensource bootstrap build file.<br>
 * This is a very minimalistic build. The main thing it does is to create a file 'aria-templates-x.y.z.js' as a
 * concatenation of the framework's most essential files. The x.y.z stands for current release version that is read from
 * JSON config file.<br>
 * It also:
 * <ul>
 * <li>updates license headers in all the files accordingly,</li>
 * <li>renames skin file to include the version in the name and normalizes it.</li>
 * </ul>
 */

module.exports = function (grunt) {
    var atExtensions = ['**/*.js', '**/*.tpl', '**/*.tpl.css', '**/*.tpl.txt', '**/*.tml', '**/*.cml'];
    var mainATFile = 'aria/<%= pkg.name %>-<%= pkg.version %>.js';

    grunt.config.set('atpackager.bootstrap', {
        options : {
            sourceDirectories : ['src'],
            sourceFiles : ['aria/**/*', '!aria/node.js', '!aria/bootstrap.js', 'aria-tester.html'],
            defaultBuilder : {
                type : 'ATMultipart',
                cfg : {
                    header : '<%= packaging.license %>'
                }
            },
            outputDirectory : '<%= packaging.bootstrap.outputdir %>',
            visitors : [{
                        type : 'CheckDependencies',
                        cfg : {
                            // only check dependencies for the bootstrap
                            files : [mainATFile]
                        }
                    }, 'ATDependencies', {
                        type : 'JSStripBanner',
                        cfg : {
                            files : atExtensions
                        }
                    }, {
                        type : "TextReplace",
                        cfg : {
                            files : ['aria/Aria.js'],
                            replacements : [{
                                        find : "ARIA-SNAPSHOT",
                                        replace : '<%= pkg.version %>'
                                    }]
                        }
                    }, {
                        type : "TextReplace",
                        cfg : {
                            files : ['aria-tester.html'],
                            replacements : [{
                                        find : "aria/bootstrap.js",
                                        replace : mainATFile
                                    }, {
                                        find : "aria/css/atskin.js",
                                        replace : "aria/css/atskin-<%= pkg.version %>.js"
                                    }]
                        }
                    }, {
                    }, {
                        type : 'ATNormalizeSkin',
                        cfg : {
                            files : ['aria/css/*.js']
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : atExtensions,
                            builder : {
                                type : 'Concat',
                                cfg : {
                                    header : '<%= packaging.license %>'
                                }
                            }
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : ['aria-tester.html'],
                            builder: 'Concat'
                        }
                    }, 'CopyUnpackaged'],
            packages : [{
                        name : mainATFile,
                        builder : {
                            type : 'Concat',
                            cfg : {
                                header : '<%= packaging.license %>'
                            }
                        },
                        files : '<%= packaging.bootstrap.files %>'
                    }, {
                        name : 'aria/css/atskin-<%= pkg.version %>.js',
                        files : ['aria/css/atskin.js']
                    }, {
                        name : 'aria/css/atflatskin-<%= pkg.version %>.js',
                        files : ['aria/css/atflatskin.js']
                    }]
        }
    });

    grunt.config.set('removedirs.bootstrap', {
        folders : ['<%= packaging.bootstrap.outputdir %>']
    });

    grunt.registerTask('bootstrap', 'atpackager:bootstrap');

};
