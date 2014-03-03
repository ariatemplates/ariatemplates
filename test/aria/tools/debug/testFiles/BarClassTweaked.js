/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : "test.aria.tools.debug.testFiles.BarClass",
    $extends : "test.aria.tools.debug.testFiles.QuuxIntermediaryClass",
    $constructor : function (number) {
        this._tweakedConstructorParam = number;
        if (this.$QuuxIntermediaryClass) {
            this.$QuuxIntermediaryClass.constructor.call(this);
        }
    },
    $statics : {
        STATIC1 : "tweaked",
        STATIC5 : "tweaked"
    },
    $prototype : {
        protoVariable1 : "tweaked",
        method1 : function () {
            return "tweaked";
        },
        method5 : function () {
            return "tweaked";
        }
    }
});
