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
            description : "raised when unloadTemplate is finished"
        }
    },
    $prototype : {
        /**
         * Unload a template (cache/files/urls/scripts/CSS associated)
         * @param {String} classpath the classpath of the class to be removed
         * @param {Boolean} timestampNextTime if true, the next time the class is loaded, browser and server cache will
         * be bypassed by adding a timestamp to the url.
         */
        unloadTemplate : function (classpath, timestampNextTime) {
            this._unloadTemplate(classpath, timestampNextTime, false, function() { return true; });
        },
        
        /**
         * Unload a template (cache/files/urls/scripts/CSS associated) and its parents
         * @param {String} classpath the classpath of the class to be removed
         * @param {Boolean} timestampNextTime if true, the next time the class is loaded, browser and server cache will
         * be bypassed by adding a timestamp to the url.
         * @param {Function} a closure that is called with the resource classpath to be unloaded and informs if it
         * should actually be unloaded tests whether a given classpath is to be unloaded, must return <code>true</code>
         * only for classpaths owned by the caller.
         */
        unloadTemplateRecursive : function (classpath, timestampNextTime, tester) {
            this._unloadTemplate(classpath, timestampNextTime, true, tester);
        },
        
        /**
         * Unload a template (cache/files/urls/scripts/CSS associated) and its parents
         * @private
         * @param {String} classpath the classpath of the class to be removed
         * @param {Boolean} timestampNextTime if true, the next time the class is loaded, browser and server cache will
         * be bypassed by adding a timestamp to the url.
         * @param {Boolean} recursive if true, the parent is investigated for unloading.
         * @param {Function} a closure that is called with the resource classpath to be unloaded and informs if it
         * should actually be unloaded, must return <code>true</code> only for classpaths owned by the caller.
         */
        _unloadTemplate : function (classpath, timestampNextTime, recursive, tester) {
            var classMgr = aria.core.ClassMgr;
            var classCaller = function (cp) {
                if (recursive) {
                    classMgr.unloadClass(cp, timestampNextTime);
                } else {
                    classMgr.unloadClassRecursive(cp, timestampNextTime, tester);
                }
            }
            // Clean template script
            var scriptClasspath = classpath + "Script";
            if (tester(scriptClasspath)) {
                if (Aria.nspace(scriptClasspath, false) || aria.core.Cache.getItem("classes", scriptClasspath)) {
                    classCaller(scriptClasspath);
                }
            }
            // every thing is done : CSS are handled at classMgr level directly
            classCaller(classpath);
            this.$raiseEvent("unloadTemplate");
        }
    }
});