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
 * This is a very minimalistic build. The main thing it does is to create a file 'aria-templates-x.y.z.js' containing
 * noder-js and able to load the core part of the framework. The x.y.z stands for current release version that is read
 * from JSON config file.<br>
 * It also:
 * <ul>
 * <li>updates license headers in all the files accordingly,</li>
 * <li>renames skin file to include the version in the name and normalizes it.</li>
 * </ul>
 */

module.exports = function (grunt) {
    var atExtensions = ['**/*.js', '**/*.tpl', '**/*.tpl.css', '**/*.tpl.txt', '**/*.tml', '**/*.cml'];

    var getNoderPackage = function (packageFile, mainFile, environment) {
        return {
            name : packageFile,
            builder : {
                type : 'NoderBootstrapPackage',
                cfg : {
                    header : '<%= packaging.license %>',
                    noderModules : ['src/noder-modules/*'],
                    noderEnvironment : environment,
                    noderConfigOptions : {
                        main : mainFile,
                        failFast : false,
                        resolver : {
                            "default" : {
                                ariatemplates : "aria"
                            }
                        },
                        packaging : {
                            ariatemplates : true
                        }
                    }
                }
            },
            files : [mainFile]
        };
    };

    grunt.config.set('atpackager.bootstrap', {
        options : {
            sourceDirectories : ['src'],
            sourceFiles : ['aria/**/*', '!aria/node.js', '!aria/bootstrap.tpl.js', '!aria/css/**'],
            outputDirectory : '<%= packaging.bootstrap.outputdir %>',
            visitors : [{
                        type : 'NoderPlugins',
                        cfg : {
                            targetBaseLogicalPath : "aria",
                            targetFiles : "aria/noderError/**"
                        }
                    }, {
                        type : 'NoderRequiresGenerator',
                        cfg : {
                            requireFunction : "syncRequire",
                            wrapper : "<%= grunt.file.read('src/aria/bootstrap.tpl.js') %>",
                            targetLogicalPath : 'aria/bootstrap.js',
                            requires : '<%= packaging.bootstrap.files %>'
                        }
                    }, {
                        type : 'NoderRequiresGenerator',
                        cfg : {
                            requireFunction : "syncRequire",
                            wrapper : "<%= grunt.file.read('src/aria/bootstrap.tpl.js') %>",
                            targetLogicalPath : 'aria/bootstrap-node.js',
                            requires : '<%= packaging.bootstrap.files %>'
                        }
                    }, {
                        type : 'ATNoderConverter',
                        cfg : {
                            files : ['aria/**/*.js']
                        }
                    }, {
                        type : 'CheckGlobals',
                        cfg : {
                            files : '<%= packaging.check_globals.files %>',
                            allowCommonJSGlobals : true,
                            allowedGlobals : ["aria", "Aria", "setTimeout", "clearTimeout", "setInterval",
                                    "clearInterval", "global"]
                        }
                    }, {
                        type : 'JSStripBanner',
                        cfg : {
                            files : atExtensions.concat("!aria/noderError/**")
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
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : atExtensions,
                            builder : {
                                type : 'Concat',
                                cfg : {
                                    header : '<%= packaging.license_min %>'
                                }
                            }
                        }
                    }, 'CopyUnpackaged'],
            packages : [getNoderPackage('<%= packaging.main_file %>', "aria/bootstrap.js", "browser"),
                    getNoderPackage("aria/node.js", "aria/bootstrap-node.js", "node")]
        }
    });

    grunt.config.set('removedirs.bootstrap', {
        folders : ['<%= packaging.bootstrap.outputdir %>']
    });

    // For bootstrap build, it makes more sense to have unversioned main AT file (ariatemplates-latest)
    // and skin files (atskin-latest etc.) so they can be included in HTML files for development,
    // though for backward compatibility, the versioned ones (ariatemplates-1.x.x, atskin-1.x.x) should be kept too.
    // The easiest way to do is to just copy the versioned files to unversioned paths.
    grunt.registerTask('copyBootstrap', 'Copy versioned bootstrap file to a generic, unversioned path', function () {
        var src = grunt.template.process('<%= packaging.bootstrap.outputdir + "/" + packaging.main_file %>');
        var dest = grunt.template.process('<%= packaging.bootstrap.outputdir + "/" + packaging.main_file_latest %>');
        grunt.file.copy(src, dest);
    });

    grunt.registerTask('copySkins', 'Copy versioned bootstrap skin file to generic, unversioned paths', function () {
        var cwd = grunt.template.process('<%= packaging.bootstrap.outputdir %>');
        var version = grunt.template.process('-<%= pkg.version %>');

        var skinFiles = grunt.file.expand(cwd + '/aria/css/*.js');

        skinFiles.forEach(function (srcFile) {
            var destFile = srcFile.replace(version, "-latest");
            grunt.file.copy(srcFile, destFile);
        });
    });

    grunt.registerTask('bootstrap', ['atpackager:bootstrap', 'atpackager:bootstrapSkin', 'copyBootstrap', 'copySkins']);

};
