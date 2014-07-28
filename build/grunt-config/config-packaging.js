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

var path = require('path');

var getPath = function (lastPart) {
    return path.join(__dirname, lastPart);
};

module.exports = function (grunt) {

    var pkg = require('../../package.json');
    var atExtensions = ['**/*.js', '**/*.tpl', '**/*.tpl.css', '**/*.tpl.txt', '**/*.tml', '**/*.cml'];

    grunt.config.set('pkg', pkg);

    return {
        bootstrap : {
            outputDirectory : getPath('../target/bootstrap'),
            files : require('../config/files-bootstrap.json'),
            checkGlobalsFiles : ['**/*.js', '!aria/noderError/**'],
            bootstrapFileName : 'aria/' + pkg.name + '-' + pkg.version + '.js'
        },
        prod : {
            // in the outputDirectory option here we don't use the getPath method because this setting becomes the
            // default output directory for the packages of a project. If someone installs ariatemplates in their
            // project and makes a custom build without specifying an output directory, we want the output of the build
            // to end up in the root build\target folder of their project
            outputDirectory : 'build/target/production',
            sourceDirectories : [getPath('../target/bootstrap')],
            noderModulesPath : getPath('../../src/noder-modules'),
            allowUnpackagedFiles : [],
            hashIncludeFiles : [],
            clean : true
        },
        license : grunt.file.read(getPath('../templates/LICENSE')),
        licenseMin : grunt.file.read(getPath('../templates/LICENSE-MIN')),
        pkg : pkg,
        atExtensions : atExtensions

    };
};
