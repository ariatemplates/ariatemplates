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
var Aria = require("../Aria");
var ariaCoreCache = require("../core/Cache");
var ariaCoreClassMgr = require("../core/ClassMgr");
var ariaCoreDownloadMgr = require("../core/DownloadMgr");
var resourcesPlugin = require("../$resources");

var resolveLogicalPath = function (curModule, logicalPath) {
    try {
        logicalPath = curModule.require.resolve(logicalPath);
    } catch (e) {}
    return logicalPath;
};

var resourcesPluginLogicalPath = resolveLogicalPath(module, "../$resources");

var processArg = function (curModule, arg) {
    if (typeof arg == "string") {
        return arg;
    } else if (arg && arg.length == 1) {
        var item = arg[0];
        if (item == "__dirname") {
            return curModule.dirname;
        } else if (item == "__filename") {
            return curModule.filename;
        } else if (item == "null") {
            return null;
        } else if (item == "module") {
            return curModule;
        }
    }
};

var unloadFailingDependencies = function (resolvedLogicalPath, timestampNextTime) {
    var curModule = require.cache[resolvedLogicalPath];
    if (curModule && curModule.noderInfo && curModule.noderInfo.preloading
            && curModule.noderInfo.preloading.isRejected()) {
        var dependencies = curModule.noderInfo.dependencies;
        if (dependencies) {
            for (var i = 0, l = dependencies.length; i < l; i++) {
                var curDependency = dependencies[i];
                if (typeof curDependency == "string") {
                    unloadFailingDependencies(resolveLogicalPath(curModule, curDependency), timestampNextTime);
                } else if (curDependency && curDependency.module) {
                    var pluginModule = resolveLogicalPath(curModule, curDependency.module);
                    if (pluginModule == resourcesPluginLogicalPath) {
                        var argStart = curDependency.method == "module" ? 1 : curDependency.method == "file" ? 0 : null;
                        if (argStart !== null) {
                            var args = curDependency.args;
                            resourcesPlugin.unload(processArg(curModule, args[argStart]), processArg(curModule, args[argStart
                                    + 1]), true, timestampNextTime, true);
                        }
                    }
                }
            }
        }
        ariaCoreDownloadMgr.clearFile(resolvedLogicalPath, timestampNextTime);
        delete require.cache[resolvedLogicalPath];
    }
};

module.exports = Aria.classDefinition({
    $classpath : "aria.templates.TemplateManager",
    $singleton : true,
    $events : {
        "unloadTemplate" : {
            description : "raised when unloadTemplate is finished",
            properties : {
                classpath : "classpath of the template that has been unloaded"
            }
        }
    },
    $prototype : {
        /**
         * Unload a template (cache/files/urls/scripts/CSS/resources associated) and its ancestors
         * @param {String} classpath the classpath of the class to be removed
         * @param {Boolean} timestampNextTime if true, the next time the class is loaded, browser and server cache will
         * be bypassed by adding a timestamp to the url.
         * @param {String} stopAtClasspath if specified all ancestors up to it (included) will be unloaded. If undefined
         * only the template, defined by classpath, is unloaded.
         */
        unloadTemplate : function (classpath, timestampNextTime, stopAtClasspath) {
            var classMgr = ariaCoreClassMgr;
            var scriptClasspath = classpath + "Script";
            var scriptLogicalPath = Aria.getLogicalPath(scriptClasspath, ".js");
            // do some cleaning in cache
            if (Aria.nspace(scriptClasspath, false) || ariaCoreCache.getItem("files", scriptLogicalPath)) {
                classMgr.unloadClass(scriptClasspath, timestampNextTime);
            }
            var itm = Aria.$classDefinitions[classpath];
            if (itm) {
                if (!Aria.nspace(classpath, false) && itm.$css) {
                    // when there is an error in the script, the class reference for the template is not created, so the
                    // css would not be unregistered in the unloadClass method
                    aria.templates.CSSMgr.unregisterDependencies(classpath, itm.$css, true, timestampNextTime);
                }
                if (itm.$resources != null) {
                    var resources = itm.$resources;
                    for (var res in resources) {
                        var curRes = resources[res];
                        if (resources.hasOwnProperty(res) && !curRes.hasOwnProperty("provider")) {
                            classMgr.unloadClass(Aria.getClasspath(curRes), timestampNextTime);
                        }
                    }
                }
                var ext = Aria.getClasspath(itm.$extends);
                if ((ext != null) && (ext != "aria.templates.Template")) {
                    if ((stopAtClasspath !== undefined) && (stopAtClasspath != classpath)) {
                        this.unloadTemplate(ext, timestampNextTime, stopAtClasspath);
                    }
                }
            } else {
                // The template does not seem to be fully loaded currently.
                // Maybe it failed to be loaded. Let's unload any of its dependencies which may have prevented it from
                // being loaded.
                // This is needed especially for the use case in test.aria.templates.reloadResources.ReloadResourcesTestCase
                unloadFailingDependencies(Aria.getLogicalPath(classpath, ".tpl", true), timestampNextTime);
            }
            classMgr.unloadClass(classpath, timestampNextTime);
            // every thing is done : CSS are unhandled at classMgr level directly
            this.$raiseEvent({
                name : "unloadTemplate",
                classpath : classpath
            });
        }
    }
});
