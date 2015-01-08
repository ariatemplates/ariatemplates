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
    $classpath : "test.aria.templates.events.delegate.DelegateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ['aria.utils.Function'],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.events.delegate.DelegateTemplate",
            data : {
                events : []
            }
        });

        this.defaultTestTimeout = 6000;
    },
    $prototype : {
        runTemplateTest : function () {
            var reference = aria.utils.Dom.getElementById("internalChild");

            // Move the mouse over the right element
            Syn.move({
                from : {
                    clientX : 0,
                    clientY : 0
                },
                to : {
                    clientX : reference.offsetLeft + 100,
                    clientY : reference.offsetTop + 150
                },
                duration : 800
            }, Aria.$window.document.body);

            aria.core.Timer.addCallback({
                fn : this._moveComplete,
                scope : this,
                delay : 1200
            });
        },

        _moveComplete : function () {
            // Check that both the template and the css are downloaded again
            var data = this.templateCtxt.data;

            this.assertEquals(data.events.length, 2, "There should be %2 events instead of %1");
            this.assertEquals(data.events[0], "mouseenter on right container", "The first event should be a '%2' instead of '%1'");
            this.assertEquals(data.events[1], "mouseleave on right container", "The second event should be a '%2' instead of '%1'");
            this.assertEquals(data.events[2], undefined, "The third event shouldn't exits, having %1 instead");

            data.events = [];

            this.clickTest();

        },

        clickTest : function () {
            Syn.rightClick({}, "clickTest", aria.utils.Function.bind(this.afterClick, this));
        },

        afterClick : function () {
            var data = this.templateCtxt.data;
            this.assertEquals(data.events.length, 0, "There should no event");
            this.notifyTemplateTestEnd();
        }

    }
});
