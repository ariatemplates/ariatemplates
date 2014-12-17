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
            src : ['src/aria/node.js', 'Gruntfile.js', 'build/config/*.json', 'build/grunt-tasks/*.js',
                    'build/grunt-config/*.js', 'build/*.js']
        },
        source : {
            src : [
                    'src/aria/**/*.js',
                    // Excludes generated files:
                    '!src/aria/bootstrap.js',
                    '!src/aria/bootstrap-node.js',
                    '!src/aria/noderError/**',
                    // Using node.js globals
                    '!src/aria/node.js',
                    // Resource and skin definitions use the global Aria without require
                    '!src/aria/css/*.js', '!src/aria/resources/CalendarRes*.js', '!src/aria/resources/DateRes*.js',
                    '!src/aria/resources/multiselect/FooterRes*.js', '!src/aria/utils/UtilsRes.js',
                    '!src/aria/widgets/WidgetsRes.js',
                    // Showdown.js direct include inside a classDefinition. We do not want to touch it
                    '!src/aria/pageEngine/contentProcessors/MarkdownProcessor.js',
                    // ua-parser.js direct include inside a package. We do not want to touch it
                    '!src/aria/core/useragent/ua-parser.js']
        },
        resource : {
            // Resource and skin definitions use the global Aria without require
            src : ['src/aria/css/*.js', 'src/aria/resources/CalendarRes*.js', 'src/aria/resources/DateRes*.js',
                    'src/aria/resources/multiselect/FooterRes*.js', 'src/aria/utils/UtilsRes.js',
                    'src/aria/widgets/WidgetsRes.js'],
            options : {
                "globals" : {
                    // allowing read-only access to Aria
                    "Aria" : false
                }
            }
        },
        test : {
            files : {
                src : ['test/**/*.js', '!test/node/**/*.js',
                        // Using some window globals
                        '!test/iframeLoaderOs.js',
                        // Syntax errors, used for testing
                        '!test/aria/templates/test/error/*.js',
                        // Syntax errors, used for testing
                        '!test/aria/templates/reloadResources/ExternalResourceErr.js',
                        '!test/nodeTestResources/testProject/target/**/*']
            },
            options : {
                "unused" : false,
                "globals" : {
                    "aria" : false,
                    "Aria" : true, // allowing to override this global
                    "test" : false,
                    "Syn" : false
                }
            }
        },
        node : {
            src : ['test/node/**/*.js'],
            options : {
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
        src : ['src/**/*.js', 'test/**/*.js', '!src/aria/pageEngine/contentProcessors/MarkdownProcessor.js',
                '!test/nodeTestResources/testProject/target/**/*']
    });

    grunt.registerTask('checkStyle', ['jshint:build', 'jshint:node', 'jshint:source', 'jshint:resource',
            'verifylowercase:sourceFiles', 'leadingIndent:jsFiles']);
    grunt.registerTask('checkStyleTest', ['jshint:test']);
};
