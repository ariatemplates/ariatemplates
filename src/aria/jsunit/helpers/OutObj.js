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

/**
 * Helper to simulate a writer used in template context
 * @class aria.jsunit.helpers.OutObj
 */
Aria.classDefinition({
    $classpath : 'aria.jsunit.helpers.OutObj',
    $dependencies : ['aria.utils.Dom'],
    $singleton : true,
    $constructor : function () {
        this.testArea = aria.utils.Dom.getElementById("TESTAREA");
        this.store = "";
    },
    $destructor : function () {
        this.testArea = null;
        this.store = null;
    }, 
    $prototype : {
        tplCtxt : {
            $getId : function (id) {
                return ["testOutput", id].join("_");
            },
            evalCallback : function (callback, arg) {
                return aria.jsunit.helpers.OutObj.$callback(callback, arg);
            }
        },
        write : function (str) {
            this.store += str;
        },
        putInDOM : function () {
            this.testArea.innerHTML = this.store;
        },
        clearAll : function () {
            this.testArea.innerHTML = "";
            this.store = "";
        },
        callMacro : function (macro) {},
        beginSection : function () {},
        endSection : function () {}
    }
})