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
 * Aria Templates bootstrap build file for files generated in the source folder directly.
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

    grunt.config.set('atpackager.bootstrapSrc', {
        options : {
            sourceDirectories : ['src'],
            sourceFiles : [],
            outputDirectory : 'src',
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
                    }],
            packages : [getNoderPackage("aria/bootstrap.js", "aria/bootstrap.js", "browser"),
                    getNoderPackage("aria/bootstrap-node.js", "aria/bootstrap-node.js", "node")]
        }
    });

    grunt.config.set('removedirs.bootstrapSrc', {
        folders : ['src/aria/noderError']
    });

    grunt.registerTask('src', ['removedirs:bootstrapSrc', 'atpackager:bootstrapSrc']);
};
