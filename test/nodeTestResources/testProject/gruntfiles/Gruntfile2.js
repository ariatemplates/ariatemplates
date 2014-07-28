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

    // two different executions of the task. To check whether url maps are merged in the same file
    grunt.registerTask('default', ['easypackage:one', 'easypackage:two']);
    grunt.loadTasks('../../../../tasks');
    grunt.config.set('easypackage.one', {
        options : {
            outputDirectory : path.join(__dirname, "../target/two"),
            sourceDirectories : [path.join(__dirname, '../src')],
            sourceFiles : ['**/*', '!app/**/*'],
            packages : [{
                        "name" : "plugins.js",
                        "files" : ["atplugins/**/*", "!atplugins/lightWidgets/DropDown.js"]
                    }],
            ATAppEnvironment : {
                defaultWidgetLibs : {
                    "light" : "atplugins.lightWidgets.LightWidgetLib"
                }
            },
            clean : true,
            convertToNoderjs : false,
            includeDependencies : true,
            minify : false,
            gzipStats : true,
            hash : false,
            compileTemplates : false,
            map : 'anotherMap.js'
        }
    });
    // this is also to check if, when templates are not compiled, they are excluded automatically from minification
    grunt.config.set('easypackage.two', {
        options : {
            outputDirectory : path.join(__dirname, "../target/two"),
            sourceDirectories : [path.join(__dirname, '../src')],
            sourceFiles : ['**/*', '!atplugins/**/*'],
            packages : [{
                        "name" : "app.js",
                        "files" : ["app/**/*", "!app/**/*.png"]
                    }],
            ATAppEnvironment : {
                defaultWidgetLibs : {
                    "light" : "atplugins.lightWidgets.LightWidgetLib"
                }
            },
            clean : false,
            convertToNoderjs : false,
            includeDependencies : false,
            minify : true,
            gzipStats : true,
            hash : false,
            compileTemplates : false,
            map : 'anotherMap.js'
        }
    });

};
