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
    $classpath : "test.aria.templates.popup.zIndex.ZIndex",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            data : {
                visible : false
            }
        });
    },
    $statics : {
        myself : null,

        firstZIndex : function () {
            var dialog = this.myself.getWidgetInstance.call(this.myself, "dialog");
            var value = dialog._popup.computedStyle.zIndex;

            this.zIndex1 = value;
        },

        secondZIndex : function (value) {
            var dialog = this.myself.getWidgetInstance.call(this.myself, "dialog");
            var value = dialog._popup.computedStyle.zIndex;

            this.zIndex2 = value;

            this.myself.compareZIndex.call(this.myself, this.zIndex1, this.zIndex2);
        }
    },
    $prototype : {
        runTemplateTest : function () {
            test.aria.templates.popup.zIndex.ZIndex.myself = this;

            aria.utils.Json.setValue(this.templateCtxt.data, "visible", true);
        },

        compareZIndex : function (one, two) {

            this.assertEquals(one, two, "zIndex changed after a partial refresh: " + one + " -> " + two);
            aria.core.Timer.addCallback({
                fn : this._closeDialog,
                scope : this,
                delay : 1000
            });
        },

        _closeDialog : function () {
            aria.utils.Json.setValue(this.templateCtxt.data, "visible", false);
            test.aria.templates.popup.zIndex.ZIndex.myself = null;

            this.end();
        }
    }
});
