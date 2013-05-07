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
    $classpath : "test.aria.templates.css.events.EventsTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        // we declare we'll load TemplateA, but the customization environment will actually load Template B
        this.setTestEnv({
            template : "test.aria.templates.css.events.Main",
            data : {
                template1 : true,
                template2 : false,
                step : 0,
                eventsRaised : []
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // check the event for template Main was raised
            var events = this.env.data.eventsRaised;

            // There should be three events: two dependenciesLoaded from Main and Template1
            // and one styleChage from Template1
            this.assertEquals(events.length, 3);
            this.assertTrue(this._helperCheck(events, "dependenciesLoaded", "test.aria.templates.css.events.Main"), "Main missing");
            this.assertTrue(this._helperCheck(events, "dependenciesLoaded", "test.aria.templates.css.events.Template1"), "Template1 missing");
            this.assertTrue(this._helperCheck(events, "styleChange", "test.aria.templates.css.events.Template1"), "StyleCahnge missing");

            // Click on the button
            this.templateCtxt.$on({
                "Ready" : {
                    fn : this.__state1,
                    scope : this
                }
            });

            aria.utils.Json.setValue(this.env.data, "template1", false);
        },

        /**
         * Check that an array of events contains an event with the specified name and classpath
         */
        _helperCheck : function (events, name, template) {
            for (var i = 0, len = events.length; i < len; i += 1) {
                if (events[i].name === name && events[i].templateClasspath === template) {
                    return true;
                }
            }
            return false;
        },

        __state1 : function () {
            // We should have at least the template unload
            var events = this.env.data.eventsRaised;
            this.assertTrue(this._helperCheck(events, "dependenciesUnloaded", "test.aria.templates.css.events.Template1"), "e");
            this.notifyTemplateTestEnd();
        }
    }
});
