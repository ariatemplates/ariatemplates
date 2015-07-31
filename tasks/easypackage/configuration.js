/*
 * Copyright 2013 Amadeus s.a.s.
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

module.exports = function (grunt, args) {

    var packagingSettings = require('../../build/grunt-config/config-packaging')(grunt);

    var atExtensions = packagingSettings.atExtensions;
    var hashFiles = atExtensions.concat(['!' + args.map]);

    if (args.convertToNoderjs === true) {
        args.convertToNoderjs = ['**/*.js'];
    }

    if (args.license) {
        args.license += "\r\n";
    }

    var options = {
        ATBootstrapFile : packagingSettings.bootstrap.bootstrapFileName,
        ATDirectories : packagingSettings.prod.sourceDirectories,
        ATAppEnvironment : args.ATAppEnvironment,
        sourceDirectories : args.sourceDirectories,
        sourceFiles : args.sourceFiles.concat(['!' + packagingSettings.bootstrap.bootstrapFileName]),
        defaultBuilder : {
            type : 'ATFillCache',
            cfg : {
                header : args.license
            }
        },
        outputDirectory : args.outputDirectory,
        visitors : [
                args.includeDependencies ? {
                    type : 'ATDependencies',
                    cfg : {
                        externalDependencies : ['aria/**'],
                        files : atExtensions
                    }
                } : null, args.includeDependencies ? {
                    type : 'NoderDependencies',
                    cfg : {
                        externalDependencies : ['noder-js/**', 'ariatemplates/**'],
                        files : atExtensions
                    }
                } : null, args.includeDependencies ? {
                    type : 'CheckDependencies',
                    cfg : {
                        noCircularDependencies : false,
                        checkPackagesOrder : false
                    }
                } : null, args.validateTemplates ? 'ATValidateTemplates' : null,
                args.compileTemplates ? 'ATCompileTemplates' : null, 'ATRemoveDoc', args.convertToNoderjs ? {
                    type : 'ATNoderConverter',
                    cfg : {
                        files : args.convertToNoderjs
                    }
                } : null, args.minify ? {
                    type : 'JSMinify',
                    cfg : {
                        files : args.compileTemplates ? atExtensions : ['**/*.js'],
                        mangle : {
                            toplevel : true
                        },
                        output : {
                            ascii_only : true,
                            comments : /@(license|preserve)/
                        }
                    }
                } : null, args.hash ? {
                    type : 'Hash',
                    cfg : {
                        hash : "murmur3",
                        files : hashFiles
                    }
                } : null, {
                    type : 'ATUrlMap',
                    cfg : {
                        mapFile : args.map,
                        onlyATMultipart : false,
                        sourceFiles : hashFiles,
                        starCompress : args.starCompress,
                        starStarCompress : args.starStarCompress
                    }
                }, args.stripBanner ? {
                    type : 'JSStripBanner',
                    cfg : {
                        files : atExtensions
                    }
                } : null, {
                    type : 'CopyUnpackaged',
                    cfg : {
                        files : atExtensions,
                        builder : {
                            type : 'ATMultipart',
                            cfg : {
                                header : args.license
                            }
                        }
                    }
                }, {
                    type : 'CopyUnpackaged',
                    cfg : {
                        files : ['**/*']
                    }
                }, args.checkPackaged ? 'CheckPackaged' : null],
        packages : args.packages
    };

    return {
        options : options
    };

};
