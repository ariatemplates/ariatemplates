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
    $classpath : "test.aria.widgets.form.select.dispose.DisposeTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.form.select.dispose.DisposeTemplate"
        });
    },
    $prototype : {
        count : 0,

        runTemplateTest : function () {
            var select = this.getWidgetInstance("select").getSelectField();

            // Instrument the update container size function
            var oldFn = aria.widgets.container.Container.prototype._updateContainerSize;
            var that = this;
            aria.widgets.container.Container.prototype._updateContainerSize = function () {
                that.count += 1;
                return oldFn.apply(this, arguments);
            };

            this.synEvent.click(select, {
                fn : this.afterClick,
                scope : this
            });
        },

        afterClick : function () {
            // Give some time to completely open the select
            aria.core.Timer.addCallback({
                fn : this.afterOpen,
                scope : this,
                delay : 200
            });
        },

        afterOpen : function () {
            this.assertTrue(this.count < 5, "Regression on update counter size called more than 4 times");
            this.count = 0;

            var span = aria.utils.Dom.getElementById("from");
            this.synEvent.click(span, {
                fn : this.afterClose,
                scope : this
            });
        },

        afterClose : function () {
            this.assertTrue(this.count === 0, "Update counter size shouldn't be called by the destructor");

            this.notifyTemplateTestEnd();
        }
    }
});