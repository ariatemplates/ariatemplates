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
    $classpath : "test.aria.widgets.form.select.downArrowKey.SelectTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.popups.PopupManager", "aria.core.Timer"],
    $destructor : function () {
        this.select = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this.select = this.getWidgetInstance("mySelect").getSelectField();
            this.synEvent.click(this.select, {
                fn : this._selectClicked,
                scope : this
            });
        },

        _selectClicked : function () {
            aria.core.Timer.addCallback({
                fn : this._afterDelay,
                scope : this,
                delay : 500
            });
        },

        _afterDelay : function () {
            this.synEvent.type(this.select, "[down][enter]", {
                fn : this._afterEnter,
                scope : this
            });
        },

        _afterEnter : function () {
            this.assertTrue(this.templateCtxt.data.value == "opt2");
            this.notifyTemplateTestEnd();
        }
    }
});
