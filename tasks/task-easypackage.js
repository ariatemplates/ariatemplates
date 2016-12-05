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
var configuration = require('./easypackage/configuration');

var getModulePath = function (pkgName, pathInPkg) {
    var pkgJsonPath = require.resolve(pkgName + "/package.json");
    return path.join(path.dirname(pkgJsonPath), pathInPkg || ".");
};

module.exports = function (grunt) {
    grunt.loadTasks(getModulePath('atpackager', 'tasks'));
    require(getModulePath('atpackager')).loadPlugin(getModulePath('noder-js', 'atpackager'));
    require(getModulePath('atpackager')).loadPlugin(getModulePath('at-noder-converter', 'atpackager'));

    grunt.registerMultiTask('easypackage', 'Packaging for Aria Templates application', function () {

        var target = this.target;

        var options = this.options({
            sourceDirectories : [],
            sourceFiles : ['**/*'],
            packages : [],
            outputDirectory : 'build/target',
            map : 'map.js',
            clean : true,
            license : "",
            includeDependencies : true,
            validateTemplates : false,
            compileTemplates : true,
            minify : true,
            hash : true,
            checkPackaged : false,
            convertToNoderjs : true,
            starCompress : ['**/*'],
            starStarCompress : ['**/*'],
            ATAppEnvironment : null,
            gzipStats : false,
            stripBanner : true
        });

        require('../build/grunt-tasks/task-removedirs')(grunt);
        require('../build/grunt-tasks/task-gzipstats')(grunt);

        if (options.clean) {
            grunt.config.set('removedirs.' + target, {
                folders : [options.outputDirectory]
            });
            grunt.task.run('removedirs:' + target);
        }

        grunt.config.set('atpackager.' + target, configuration(grunt, options));
        grunt.task.run('atpackager:' + target);

        if (options.gzipStats) {
            grunt.config.set('gzipStats.' + target, {
                src : options.outputDirectory
            });
            grunt.task.run('gzipStats:' + target);
        }

    });
};