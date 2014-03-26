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
    $classpath : "test.aria.widgets.container.dialog.scroll.SetScrollTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            step : 0,
            dialogVisible : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.scroll.SetScrollTemplate",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.divWrapper = this.templateCtxt.$getElementById("myDiv");
            // In IE7, if we do not wait before calling setScroll, it is
            // not taken into account
            aria.core.Timer.addCallback({
                fn : this._afterWait,
                scope : this,
                delay : 10
            });
        },

        _afterWait : function () {
            this.divWrapper.setScroll({
                scrollTop : 300
            });
            aria.core.Timer.addCallback({
                fn : this._checkFirstScroll,
                scope : this,
                delay : 20
            });
        },

        _checkFirstScroll : function () {
            var scrollTop = this.divWrapper.getScroll().scrollTop;
            this.assertTrue(scrollTop == 300, "setScroll did not work");
            aria.utils.Json.setValue(this.data, "step", 1);
            this.templateCtxt.$refresh({
                section : "mySection"
            });
            aria.core.Timer.addCallback({
                fn : this._checkSecondScroll,
                scope : this,
                delay : 20
            });
        },

        _checkSecondScroll : function () {

            // check that the refresh was done correctly:
            var section = this.getElementById("mySection");
            this.assertTrue(section.innerHTML == "1", "refresh was not done");

            // check that the scroll position did not change
            var scrollTop = this.divWrapper.getScroll().scrollTop;
            this.assertTrue(scrollTop == 300, "scroll position was lost after the refresh of an independent section");

            this.divWrapper.$dispose();
            this.end();
        }

    }
});
