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
                    // SynEvents : dependent on https://github.com/ariatemplates/ariatemplates/issues/33
                    '!src/aria/utils/SynEvents.js',
                    // Using node.js globals
                    '!src/aria/node.js']
        }
    });

    grunt.config.set('verifylowercase.sourceFiles', {
        src : ['src/**']
    });

    grunt.registerTask('checkStyle', ['jshint', 'verifylowercase:sourceFiles']);
};