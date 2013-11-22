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

/**
 * Check that partial refresh does not cause leaks on the delegate mapping in aria.utils.Delegate (see PTR 05318413)
 * @class test.aria.templates.refresh.events.PTRTemplateTestCase
 * @extends aria.jsunit.TemplateTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.refresh.events.EventsTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.refresh.events.SampleTemplate"
        });
    },
    $destructor : function () {
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {

            var startDeleg = this.__countDelegatedMappings();
            for (var i = 0; i < 20; i++) {
                this.templateCtxt.$refresh({
                    outputSection : "sctn"
                });
            }
            var endDeleg = this.__countDelegatedMappings();

            this.assertTrue(startDeleg == endDeleg, "The delegated events have not been removed from the aria.utils.Delegate after partial refresh");

            this.end();
        },

        /**
         * Return the number non-null elements inside aria.utils.Delegate.__delegateMapping
         * @return {Integer}
         */
        __countDelegatedMappings : function () {
            var delMap = aria.utils.Delegate.__delegateMapping, counter = 0;
            for (var dm in delMap) {
                if (delMap.hasOwnProperty(dm)) {
                    if (delMap[dm] !== null) {
                        counter++;
                    }
                }
            }

            return counter;
        }

    }
});
