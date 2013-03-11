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
    var mainATFile = 'aria/<%= pkg.name %>-<%= pkg.version %>.js';

    grunt.config.set('atpackager.prod', {
        options : {
            ATBootstrapFile : mainATFile,
            sourceDirectories : ['<%= packaging.bootstrap.outputdir %>'],
            sourceFiles : ['**/*'],
            defaultBuilder : {
                type : 'ATMultipart',
                cfg : {
                    header : '<%= packaging.license %>'
                }
            },
            outputDirectory : '<%= packaging.prod.outputdir %>',
            visitors : [{
                        type : 'ATDependencies',
                        cfg : {
                            externalDependencies : '<%= packaging.bootstrap.files %>',
                            files : atExtensions.concat(['!' + mainATFile])
                        }
                    }, {
                        type : 'CheckDependencies',
                        cfg : {
                            checkPackagesOrder : false
                        }
                    }, 'ATCompileTemplates', 'ATRemoveDoc', {
                        type : 'JSMinify',
                        cfg : {
                            files : atExtensions
                        }
                    }, {
                        type : 'Hash',
                        cfg : {
                            files : atExtensions.concat(['aria/core/transport/iframeSource*',
                                    'aria/utils/FrameATLoaderHTML*', '**/*.jnlp', '!aria/css/**', '!' + mainATFile,
                                    '<%= packaging.prod.hash_include_files %>'])
                        }
                    }, {
                        type : 'ATUrlMap',
                        cfg : {
                            mapFile : mainATFile,
                            sourceFiles : ['**/*', '!aria/css/**/*'],
                            starStarCompress : ['**/*', '!aria/resources']
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : [mainATFile, 'aria/css/*.js', '<%= packaging.prod.allow_unpackaged_files %>'],
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
            packages : ['<%= packaging.prod.files %>', '<%= packaging.prod.expanded_localization_files %>']
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
