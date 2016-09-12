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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.issue1085.InitCheckboxesRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteRobotBase",
    $constructor : function () {
        this.$MultiAutoCompleteRobotBase.constructor.call(this);

        this.data.expandButton = true;
        this.checkedValues = ["P8.amino", "P6.ipsum"];
        this.data.ac_airline_values = [{
                    label : "P8.amino",
                    value : "test"
                }, {
                    label : "P6.ipsum",
                    value : "tt"
                }];

    },
    $prototype : {

        _waitAndExecute : function (fn, scope) {
            aria.core.Timer.addCallback({
                fn : fn,
                scope : scope,
                delay : 300
            });
        },

        runTemplateTest : function () {
            this.clickAndType(["[down]"], {
                fn : this._wait1,
                scope : this
            }, 1);
        },

        _wait1 : function () {
            this.waitFor({
                condition : function () {
                    return this.getElementsByClassName(Aria.$window.document.body, "xWidget xICNcheckBoxes").length !== 0;
                },
                callback : this._verifyCheckboxValues
            });
        },

        _verifyCheckboxValues : function () {
            var checkboxList = this.getElementsByClassName(Aria.$window.document.body, "xWidget xICNcheckBoxes");
            for (var i = 0, l = checkboxList.length; i < l; i++) {
                var item = checkboxList[i].parentNode;
                var input = item.getElementsByTagName("input")[0];
                var label = item.getElementsByTagName("label")[0].innerHTML;
                this.assertEquals("" + aria.utils.Array.contains(this.checkedValues, label), input.value, "The checkbox is %2 while it should be %1 instead.");
            }
            this.end();
        }

    }
});
