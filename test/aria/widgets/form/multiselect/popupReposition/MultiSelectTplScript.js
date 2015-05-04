/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : 'test.aria.widgets.form.multiselect.popupReposition.MultiSelectTplScript',
    $dependencies : ['aria.utils.Array'],
    $constructor : function () {
        var types = [];
        var list = [];
        for (var i = 0; i < 100; i++) {
            types.push({
                label: "Type dat" + i,
                value: "Type dat" + i
            });
            list.push({
                name: "File " + (2*i),
                type: "Text"
            });
            list.push({
                name: "File " + (2*i+1),
                type: "Image"
            });
        }
        types.push({label: "Text", value: "Text"});
        types.push({label: "Image", value: "Image"});
        this.filter = {
            value: ["Text", "Image"],
            options: types
        };
        this.list = list;
    },
    $prototype : {
        getFilteredList : function () {
            var list = this.list;
            var filter = this.filter.value;
            var res = [];
            for (var i = 0, l = list.length; i < l; i++) {
                var curItem = list[i];
                if (aria.utils.Array.indexOf(filter, curItem.type) > -1) {
                    res.push(curItem);
                }
            }
            return res;
        }
    }
});
