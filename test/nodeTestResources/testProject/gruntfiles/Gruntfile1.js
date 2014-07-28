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
    grunt.registerTask('default', ['easypackage:one']);
    grunt.loadTasks('../../../../tasks');
    grunt.config.set('easypackage.one', {
        options : {
            outputDirectory : path.join(__dirname, "../target/one"),
            sourceDirectories : [path.join(__dirname, '../src')],
            packages : [{
                        "name" : "app.js",
                        "files" : ["app/**/*", "!app/**/*.png"]
                    }, {
                        "name" : "plugins.js",
                        "files" : ["atplugins/**/*"]
                    }],
            license : "/* abcdefg*/",
            ATAppEnvironment : {
                defaultWidgetLibs : {
                    "light" : "atplugins.lightWidgets.LightWidgetLib"
                }
            },
            clean : false,
            convertToNoderjs : true,
            includeDependencies : false,
            minify : true,
            gzipStats : false
        }
    });

};
