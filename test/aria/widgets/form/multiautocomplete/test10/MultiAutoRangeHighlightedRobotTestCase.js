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
    $classpath : "test.aria.widgets.form.multiautocomplete.test10.MultiAutoRangeHighlightedRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteRobotBase",
    $prototype : {

        runTemplateTest : function () {
            if (!aria.core.Browser.isPhantomJS) {
                this.clickAndType(["p1-4"], {
                    fn : this._afterType,
                    scope : this
                }, 800);
            } else {
                this.end();
            }
        },

        _afterType : function () {
            var mac = this._getWidgetInstance();
            var elt = mac.controller._listWidget._domElt;
            var selected = this.getElementsByClassName(elt, "xListSelectedItem_std");

            this.assertEquals(selected.length, 4, "The suggestions are not highlighted.");

            this.clickAndType(["[backspace]", "[backspace]", "[backspace]", "[backspace]", "p1-4", "[enter]"], {
                fn: this._afterEnter,
                scope: this
            }, 800);
        },

        _afterEnter : function () {
            this.checkSelectedItems(4, ['P1.some', 'P2.kon', 'P3.red', 'P4.redd']);

            this.clickAndType(["p"], {
                fn: this._afterLastEntry,
                scope: this
            }, 800);
        },

        _afterLastEntry : function () {
            var mac = this._getWidgetInstance();
            var elt = mac.controller._listWidget._domElt;
            var selected = this.getElementsByClassName(elt, "xListSelectedItem_std");
            this.assertEquals(selected.length, 0, "There's some suggestions wrongly highlighted.");
            this.end();
        }
    }
});
