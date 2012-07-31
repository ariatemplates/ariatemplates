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
 * @class aria.widgets.transform.NotTransform
 * Performs a boolean NOT on the argument.
 */
Aria.classDefinition({
    $classpath:'aria.widgets.transform.NotTransform',
    $constructor : function() {
        this.$JsObject.constructor.call(this);
    },
    $prototype: {
        toWidget : function(val) {
            return !val;
        },
        fromWidget : function(val) {
            return !val;
        }
    }
});