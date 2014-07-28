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
 * Main entry point for grunt. The build configuration is split into several files in the ./build/grunt-config
 * directory.
 * @param {Object} grunt
 */
module.exports = function (grunt) {

    grunt.registerTask('release', ['removedirs:bootstrap', 'bootstrap', 'atbuild']);
    grunt.registerTask('default', ['gruntTimeHookStart', 'release', 'gruntTimeHookEnd']);

    grunt.loadTasks('./build/grunt-tasks');
    grunt.loadNpmTasks('atpackager');
    require('atpackager').loadNpmPlugin('noder-js');
    require('atpackager').loadNpmPlugin('at-noder-converter');

    grunt.loadNpmTasks('grunt-verifylowercase');
    grunt.loadNpmTasks('grunt-leading-indent');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    var settings = require('./build/grunt-config/config-packaging')(grunt);
    grunt.config.set('atbuild.default', {
        options : {
            gzipStats : true,
            clean : settings.prod.clean
        }
    });
    grunt.loadTasks("./tasks");

    require('./build/grunt-config/config-checkStyle')(grunt);
    require('./build/grunt-config/config-atpackager-bootstrap')(grunt);
    require('./build/grunt-config/config-extra')(grunt);
};
