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

Aria.tplScriptDefinition({
    $classpath : "test.aria.core.prototypefn.PrototypeFnTestCaseTplScript",
    $prototype : function () {
        var count = 0;
        if (aria.core.Browser.isOldIE) {
            count++;
            return {
                callMe : function () {
                    this.data.isTrue = true;
                    this.data.count = count;
                }
            };
        } else {
            count++;
            return {
                callMe : function () {
                    this.data.isTrue = true;
                    this.data.count = count;
                }
            };
        }
    }
});
