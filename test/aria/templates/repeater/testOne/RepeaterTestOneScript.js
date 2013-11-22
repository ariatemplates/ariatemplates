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

Aria.tplScriptDefinition({
    $classpath : "test.aria.templates.repeater.testOne.RepeaterTestOneScript",
    $prototype : {
        myCSSFunction : function (item) {
            return (item.ct % 2 === 0) ? "evenRow" : "oddRow";
        },
        updateRefreshCountOf : (function () {
            var index = 0;
            return function (item) {
                var sectionId = item.sectionId;
                if (!this.data.refCount[sectionId]) {
                    this.data.refCount[sectionId] = 1;
                    this.data.items[index++] = item;
                } else {
                    this.data.refCount[sectionId]++;
                }
            };
        })()
    }
});
