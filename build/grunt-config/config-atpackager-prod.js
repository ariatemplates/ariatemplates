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
 * <li>appends MD5 checksum to each file name as a way to make files cacheable for longer periods</li>.
 * </ul>
 */

module.exports = function (grunt) {
    var atExtensions = ['**/*.js', '**/*.tpl', '**/*.tpl.css', '**/*.tpl.txt', '**/*.tml', '**/*.cml'];
    var notAtExtensions = atExtensions.map(function (value) {
        return '!' + value;
    });
    var hashFiles = atExtensions.concat(['aria/core/transport/iframeSource*', 'aria/utils/FrameATLoaderHTML*',
            '**/*.swf', '**/*.jnlp', '!aria/css/**', '!<%= packaging.main_file %>',
            '<%= packaging.prod.hash_include_files %>']);

    grunt.config.set('atpackager.prod', {
        options : {
            ATBootstrapFile : '<%= packaging.main_file %>',
            sourceDirectories : ['<%= packaging.bootstrap.outputdir %>'],
            sourceFiles : ['<%= packaging.prod.source_files %>', '!<%= packaging.main_file %>'],
            defaultBuilder : {
                type : 'ATMultipart',
                cfg : {
                    header : '<%= packaging.license_min %>'
                }
            },
            outputDirectory : '<%= packaging.prod.outputdir %>',
            visitors : [{
                        type : 'NoderRequiresGenerator',
                        cfg : {
                            targetLogicalPath : 'aria/bootstrap.js',
                            requires : '<%= packaging.bootstrap.files %>'
                        }
                    }, {
                        type : 'NoderDependencies',
                        cfg : {
                            externalDependencies : ['noder-js/**'],
                            files : /*atExtensions*/['**/*.js'].concat(['!<%= packaging.main_file %>'])
                        }
                    }, {
                        type : 'CheckDependencies',
                        cfg : {
                            noCircularDependencies : false,
                            checkPackagesOrder : false
                        }
                    }, 'ATCompileTemplates', 'ATRemoveDoc', {
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
                            mapFile : '<%= packaging.main_file %>',
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
                                    header : '<%= packaging.license %>'
                                }
                            }
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : ['aria/noderError/**', '<%= packaging.prod.allow_unpackaged_files %>'],
                            builder : {
                                type : 'ATMultipart',
                                cfg : {
                                    header : '<%= packaging.license_min %>'
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
                    }, 'CheckPackaged'],
            packages : [{
                        name : '<%= packaging.main_file %>',
                        builder : {
                            type : 'NoderBootstrapPackage',
                            cfg : {
                                header : '<%= packaging.license %>',
                                noderModules : ['src/noder-modules/*'],
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
                        files : ['aria/bootstrap.js']
                    }, '<%= packaging.prod.files %>', '<%= packaging.prod.expanded_localization_files %>']
        }
    });

    grunt.config.set('gzipStats.prod', {
        src : '<%= packaging.prod.outputdir %>'
    });

    grunt.config.set('removedirs.prod', {
        folders : ['<%= packaging.prod.outputdir %>']
    });

    grunt.registerTask('expandLocalizationFiles', function () {
        var res = [];
        var savedLocale = grunt.config.getRaw('locale');
        var locales = grunt.config.get('packaging.locales');
        locales.forEach(function (curLocale) {
            grunt.config.set('locale', "_" + curLocale);
            res.push(grunt.config.get('packaging.prod.localization_files'));
        });
        grunt.config.set('locale', "");
        res.push(grunt.config.get('packaging.prod.localization_files'));
        grunt.config.set('locale', savedLocale);
        grunt.config.set('packaging.prod.expanded_localization_files', res);
    });

    grunt.registerTask('prod', ['expandLocalizationFiles', 'atpackager:prod']);
};
