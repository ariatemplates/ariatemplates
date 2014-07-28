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

var path = require('path');

var getModulePath = function (name) {
    return path.join(__dirname, '../node_modules', name);
};

module.exports = function (grunt) {
    var packagingSettings = require('../build/grunt-config/config-packaging')(grunt);

    grunt.loadTasks(getModulePath('atpackager/tasks'));
    require(getModulePath('atpackager')).loadPlugin(getModulePath('noder-js/atpackager'));
    grunt.registerMultiTask('atbuild', 'Aria Templates framework build', function () {

        var options = this.options({
            bootstrapFiles : packagingSettings.bootstrap.files,
            packages : require('../build/config/files-prod.json'),
            outputDirectory : packagingSettings.prod.outputDirectory,
            outputBootstrapFile : packagingSettings.bootstrap.bootstrapFileName,
            clean : true,
            gzipStats : false,
            checkPackaged : true
        });

        grunt.config.set('atbuildOptions', options);
        grunt.config.set('atbuildOptions.allow_unpackaged_files', options.checkPackaged
                ? packagingSettings.prod.allowUnpackagedFiles
                : ['**/*']);
        grunt.config.set('atbuildOptions.localization_files', require('../build/config/files-prod-localization.json'));
        grunt.config.set('atbuildOptions.license_min', packagingSettings.licenseMin);
        grunt.config.set('atbuildOptions.license', packagingSettings.license);

        require('../build/grunt-tasks/task-removedirs')(grunt);
        require('../build/grunt-tasks/task-gzipstats')(grunt);
        require('../build/grunt-config/config-atpackager-prod')(grunt);

        if (options.clean) {
            grunt.task.run('removedirs:prod');
        }
        grunt.task.run('prod');
        if (options.gzipStats) {
            grunt.task.run('gzipStats:prod');
        }
    });
};