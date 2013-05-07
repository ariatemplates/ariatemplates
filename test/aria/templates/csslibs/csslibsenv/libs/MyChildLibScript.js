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
    $classpath : "test.aria.templates.csslibs.csslibsenv.libs.MyChildLibScript",
    $prototype : {
        greenColor : function () {
            return "rgb(0,128,0)";
        },
        yellowColor : function () {
            return this.getYellowColor(); /* `this` should work as supposed */
        },
        getYellowColor : function () {
            return "rgb(255,255,0)";
        }
    }
});
