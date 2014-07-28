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

module.exports = function (grunt) {
    var packagingSettings = require('./config-packaging')(grunt);

    grunt.config.set('atpackager.bootstrapSkin', {
        options : {
            ATDebug : true,
            ATBootstrapFile : packagingSettings.bootstrap.bootstrapFileName,
            ATDirectories : [packagingSettings.bootstrap.outputDirectory],
            sourceDirectories : ['src'],
            sourceFiles : ['aria/css/**'],
            outputDirectory : packagingSettings.bootstrap.outputDirectory,
            visitors : [{
                        type : 'ATNormalizeSkin',
                        cfg : {
                            files : ['aria/css/*.js'],
                            strict : true
                        }
                    }, {
                        type : 'CopyUnpackaged',
                        cfg : {
                            files : ['aria/css/*.js'],
                            renameFunction : function (name) {
                                return name.replace(/.js$/, grunt.config.process('-' + packagingSettings.pkg.version + '.js'));
                            },
                            builder : {
                                type : 'Concat',
                                cfg : {
                                    header : packagingSettings.license
                                }
                            }
                        }
                    }, 'CopyUnpackaged']
        }
    });
};