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
    $classpath : "test.aria.widgets.icon.notooltip.NoTooltipIconTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            data : {
                value : 0
            }
        });

        this.defaultTestTimeout = 5000; // fail fast if can't get past waitFor
    },
    $prototype : {

        runTemplateTest : function () {
            var icon = this.getWidgetInstance("testIcon").getDom();
            this.assertEquals(this.templateCtxt.data.value, 0);
            this.synEvent.click(icon, {
                scope : this,
                fn : this._afterClick
            });
        },
        _afterClick : function () {
            this.waitFor({
                condition : function () {
                    return this.templateCtxt.data.value === 1;
                },
                callback : {
                    fn : this._afterWait,
                    scope : this
                }
            });
        },
        _afterWait : function () {
            this.assertEquals(this.templateCtxt.data.value, 1);
            this.end();
        }

    }
});
