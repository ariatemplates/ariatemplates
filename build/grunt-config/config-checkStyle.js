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
 * Style-checking grunt configuration.
 * @param {Object} grunt
 */
module.exports = function (grunt) {
    grunt.config.set('jshint', {
        options : require('../config/jshint.json'),
        build : {
            options : require('../config/jshint-build.json'),
            src : ['src/aria/node.js', 'Gruntfile.js', 'build/config/*.json', 'build/grunt-tasks/*.js',
                    'build/grunt-config/*.js', 'build/*.js']
        },
        source : {
            src : ['src/aria/**/*.js',
                    // Using node.js globals
                    '!src/aria/node.js',
                    // Showdown.js direct include inside a classDefinition. We do not want to touch it
                    '!src/aria/pageEngine/contentProcessors/MarkdownProcessor.js']
        },
        test : {
            files : {
                src : ['test/**/*.js', '!test/node/**/*.js',
                        // Using some window globals
                        '!test/iframeLoaderOs.js',
                        // Syntax errors, used for testing
                        '!test/aria/templates/test/error/*.js',
                        // Syntax errors, used for testing
                        '!test/aria/templates/reloadResources/ExternalResourceErr.js']
            },
            options : {
                "globals" : {
                    "aria": false,
                    "Aria": false,
                    "setTimeout": false,
                    "setInterval": false,
                    "clearTimeout": false,
                    "clearInterval": false,
                    "test": false,
                    "Syn": false
                }
            }
        },
        node : {
            src : ['test/node/**/*.js'],
            options : {
                "node" : true,
                "globals" : {
                    "aria" : false,
                    "Aria" : false,
                    "describe" : false,
                    "it" : false,
                    "before" : false,
                    "beforeEach" : false,
                    "after" : false,
                    "afterEach" : false
                }
            }
        }
    });

    grunt.config.set('verifylowercase.sourceFiles', {
        src : ['src/**', 'test/**']
    });

    grunt.config.set('leadingIndent.indentation', 'spaces');
    grunt.config.set('leadingIndent.jsFiles', {
        src : ['src/**/*.js', 'test/**/*.js', '!src/aria/pageEngine/contentProcessors/MarkdownProcessor.js']
    });

    grunt.registerTask('checkStyle', ['jshint', 'verifylowercase:sourceFiles', 'leadingIndent:jsFiles']);
};
