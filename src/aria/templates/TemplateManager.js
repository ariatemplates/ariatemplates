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

Aria.classDefinition({
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
            var classMgr = aria.core.ClassMgr;
            var scriptClasspath = classpath + "Script";
            var scriptLogicalPath = Aria.getLogicalPath(scriptClasspath, ".js");
            // do some cleaning in cache
            if (Aria.nspace(scriptClasspath, false) || aria.core.Cache.getItem("files", scriptLogicalPath)) {
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
                    for (var res in resources)
                        if (resources.hasOwnProperty(res) && !resources[res].hasOwnProperty("provider")) {
                            classMgr.unloadClass(resources[res], timestampNextTime);
                        }
                }
                var ext = itm.$extends;
                if ((ext != null) && (ext != "aria.templates.Template")) {
                    if ((stopAtClasspath !== undefined) && (stopAtClasspath != classpath)) {
                        this.unloadTemplate(ext, timestampNextTime, stopAtClasspath);
                    }
                }
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
