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
    var packagingSettings = require('./config-packaging')(grunt);

    var getNoderPackage = function (packageFile, mainFile, environment) {
        return {
            name : packageFile,
            builder : {
                type : 'NoderBootstrapPackage',
                cfg : {
                    header : packagingSettings.license,
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
            outputDirectory : packagingSettings.bootstrap.outputDirectory,
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
                            requires : packagingSettings.bootstrap.files
                        }
                    }, {
                        type : 'NoderRequiresGenerator',
                        cfg : {
                            requireFunction : "syncRequire",
                            wrapper : "<%= grunt.file.read('src/aria/bootstrap.tpl.js') %>",
                            targetLogicalPath : 'aria/bootstrap-node.js',
                            requires : packagingSettings.bootstrap.files
                        }
                    }, {
                        type : 'ATNoderConverter',
                        cfg : {
                            files : ['aria/**/*.js']
                        }
                    }, {
                        type : 'CheckGlobals',
                        cfg : {
                            files : packagingSettings.bootstrap.checkGlobalsFiles,
                            allowCommonJSGlobals : true,
                            allowedGlobals : ["aria", "Aria", "setTimeout", "clearTimeout", "setInterval",
                                    "clearInterval", "global"]
                        }
                    }, {
                        type : 'JSStripBanner',
                        cfg : {
                            files : packagingSettings.atExtensions.concat("!aria/noderError/**")
                        }
                    }, {
                        type : "TextReplace",
                        cfg : {
                            files : ['aria/Aria.js'],
                            replacements : [{
                                        find : "ARIA-SNAPSHOT",
                                        replace : packagingSettings.pkg.version
                                    }]
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : packagingSettings.atExtensions,
                            builder : {
                                type : 'Concat',
                                cfg : {
                                    header : packagingSettings.license_min
                                }
                            }
                        }
                    }, 'CopyUnpackaged'],
            packages : [getNoderPackage(packagingSettings.bootstrap.bootstrapFileName, "aria/bootstrap.js", "browser"),
                    getNoderPackage("aria/node.js", "aria/bootstrap-node.js", "node")]
        }
    });

    grunt.config.set('removedirs.bootstrap', {
        folders : [packagingSettings.bootstrap.outputDirectory]
    });

    require('./config-atpackager-bootstrap-skin')(grunt);

    grunt.registerTask('bootstrap', ['atpackager:bootstrap', 'atpackager:bootstrapSkin']);

};
