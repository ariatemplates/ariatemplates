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
 * Aria Templates opensource production build file.<br>
 * This build depends on the bootstrap build to execute properly.<br>
 * This build does the following things:
 * <ul>
 * <li>creates packages from multiple input files</li>,
 * <li>compiles templates to JavaScript classes</li>,
 * <li>minifies JavaScript</li>,
 * <li>adds a header in each package with license and current release version</li>,
 * <li>appends hash to each file name as a way to make files cacheable for longer periods</li>.
 * </ul>
 */

module.exports = function (grunt) {

    var packagingSettings = require('./config-packaging')(grunt);

    var atExtensions = packagingSettings.atExtensions;
    var notAtExtensions = atExtensions.map(function (value) {
        return '!' + value;
    });
    var atLoaderFileName = 'aria/atLoader-' + packagingSettings.pkg.version + '.js';
    var hashFiles = atExtensions.concat(['aria/core/transport/iframeSource*', 'aria/utils/FrameATLoaderHTML*',
            '**/*.swf', '**/*.jnlp', '!aria/css/**', '!' + atLoaderFileName, '!<%= atbuildOptions.outputBootstrapFile %>']).concat(packagingSettings.prod.hashIncludeFiles);

    grunt.config.set('atpackager.prod', {
        options : {
            ATBootstrapFile : packagingSettings.bootstrap.bootstrapFileName,
            sourceDirectories : packagingSettings.prod.sourceDirectories,
            sourceFiles : ['**/*', '!aria/node.js', '!' + packagingSettings.bootstrap.bootstrapFileName],
            defaultBuilder : {
                type : 'ATFillCache',
                cfg : {
                    header : packagingSettings.licenseMin
                }
            },
            outputDirectory : '<%= atbuildOptions.outputDirectory %>',
            visitors : [{
                        type : 'NoderRequiresGenerator',
                        cfg : {
                            targetLogicalPath : 'aria/bootstrap.js',
                            requires : '<%= atbuildOptions.bootstrapFiles %>'
                        }
                    }, {
                        type : 'NoderDependencies',
                        cfg : {
                            externalDependencies : ['noder-js/**'],
                            files : ['**/*.js'].concat(['!<%= atbuildOptions.outputBootstrapFile %>'])
                        }
                    }, {
                        type : 'CheckDependencies',
                        cfg : {
                            noCircularDependencies : false,
                            checkPackagesOrder : false
                        }
                    }, 'ATValidateTemplates', 'ATCompileTemplates', 'ATRemoveDoc', '<%= atbuildOptions.compileBeansVisitor %>', {
                        type : 'JSMinify',
                        cfg : {
                            files : atExtensions,
                            mangle : {
                                toplevel : true
                            },
                            output : {
                                ascii_only : true,
                                comments : /@(license|preserve)/
                            }
                        }
                    }, {
                        type : 'Hash',
                        cfg : {
                            hash : "murmur3",
                            files : hashFiles
                        }
                    }, {
                        // NoderMap must be before ATUrlMap
                        type : 'NoderMap',
                        cfg : {
                            sourceFiles : "aria/noderError/**",
                            noderContext : "errorContext"
                        }
                    }, {
                        type : 'ATUrlMap',
                        cfg : {
                            mapFile : '<%= atbuildOptions.outputBootstrapFile %>',
                            onlyATMultipart : false,
                            sourceFiles : hashFiles.concat('!aria/noderError/**'),
                            starCompress : ['**/*', '!aria', '!aria/resources/**'],
                            starStarCompress : ['**/*']
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : ['aria/css/*.js'],
                            builder : {
                                type : 'ATMultipart',
                                cfg : {
                                    header : packagingSettings.license
                                }
                            }
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : ['aria/noderError/**', '<%= atbuildOptions.allow_unpackaged_files %>', '!**/*.swf'],
                            builder : {
                                type : 'ATMultipart',
                                cfg : {
                                    header : packagingSettings.licenseMin
                                }
                            }
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : ['**/*.jnlp', "aria/core/transport/iframeSource.txt",
                                    "aria/utils/FrameATLoaderHTML.html"],
                            builder : 'ATMultipart'
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : ['**/*'].concat(notAtExtensions)
                        }
                    }, grunt.config.get('atbuildOptions.checkPackaged') ? 'CheckPackaged' : null],
            packages : [{
                name: atLoaderFileName,
                files: ['aria/atLoader.js'],
                builder: {
                                type : 'Concat',
                                cfg : {
                                    header : packagingSettings.licenseMin
                                }
                            }
            },{
                        name : '<%= atbuildOptions.outputBootstrapFile %>',
                        builder : {
                            type : 'NoderBootstrapPackage',
                            cfg : {
                                header : packagingSettings.license,
                                noderModules : [packagingSettings.prod.noderModulesPath + '/*'],
                                noderConfigOptions : {
                                    main : "aria/bootstrap",
                                    failFast : false,
                                    packaging : {
                                        ariatemplates : true
                                    },
                                    resolver : {
                                        "default" : {
                                            ariatemplates : "aria"
                                        }
                                    }
                                },
                                noderConfigErrorOptions : {
                                    main : "aria/noderError/error.js",
                                    packaging : {
                                        baseUrl : "%scriptdir%/../", // because paths all start with aria/
                                        requestConfig : {
                                            sync : true
                                        }
                                    }
                                }
                            }
                        },
                        files : ['aria/bootstrap.js', '<%= atbuildOptions.bootstrapFiles %>']
                    }, '<%= atbuildOptions.packages %>', '<%= atbuildOptions.expanded_localization_files %>']
        }
    });

    grunt.config.set('gzipStats.prod', {
        src : '<%= atbuildOptions.outputDirectory %>'
    });

    grunt.config.set('removedirs.prod', {
        folders : ['<%= atbuildOptions.outputDirectory %>']
    });

    grunt.registerTask('expandLocalizationFiles', function () {
        var res = [];
        var savedLocale = grunt.config.getRaw('locale');
        var locales = require('../config/locales.json');
        locales.forEach(function (curLocale) {
            grunt.config.set('locale', "_" + curLocale);
            res.push(grunt.config.get('atbuildOptions.localization_files'));
        });
        grunt.config.set('locale', "");
        res.push(grunt.config.get('atbuildOptions.localization_files'));
        grunt.config.set('locale', savedLocale);
        grunt.config.set('atbuildOptions.expanded_localization_files', res);
    });

    grunt.registerTask('prod', ['expandLocalizationFiles', 'atpackager:prod']);
};
