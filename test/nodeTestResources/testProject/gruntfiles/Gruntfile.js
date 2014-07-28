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
module.exports = function (grunt) {
    grunt.registerTask('default', ['atbuild']);
    grunt.loadTasks('../../../../tasks');
    grunt.config.set('atbuild.default', {
        options : {
            bootstrapFiles : require(path.join(__dirname, '../build/config/files-bootstrap.json')),
            packages : require(path.join(__dirname, '../build/config/files-prod.json')),
            checkPackaged : false,
            outputBootstrapFile : 'custom-at.js',
            outputDirectory : path.join(__dirname, '../target/fwk'),
            clean : true,
            gzipStats : false
        }
    });
};
