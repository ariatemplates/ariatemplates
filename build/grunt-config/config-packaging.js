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

module.exports = function (grunt) {
    grunt.config.set('packaging.locales', require('../config/locales.json'));
    grunt.config.set('packaging.bootstrap.outputdir', 'build/target/bootstrap');
    grunt.config.set('packaging.bootstrap.files', require('../config/files-bootstrap.json'));
    grunt.config.set('packaging.check_globals.files', ['**/*.js', '!aria/noderError/**']);
    grunt.config.set('packaging.prod.outputdir', 'build/target/production');
    grunt.config.set('packaging.prod.files', require('../config/files-prod.json'));
    grunt.config.set('packaging.prod.source_files', ['**/*', '!aria/node.js']);
    grunt.config.set('packaging.prod.allow_unpackaged_files', []);
    grunt.config.set('packaging.prod.localization_files', require('../config/files-prod-localization.json'));
    grunt.config.set('packaging.prod.hash_include_files', []);
    grunt.config.set('packaging.license', grunt.file.read('build/templates/LICENSE'));
    grunt.config.set('packaging.license_min', grunt.file.read('build/templates/LICENSE-MIN'));
    grunt.config.set('pkg', require('../../package.json'));
    grunt.config.set('packaging.main_file', 'aria/<%= pkg.name %>-<%= pkg.version %>.js');
};
