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
 * Check that the autorefresh of a section is working correctly with json.add
 * @class test.aria.templates.section.autorefresh.SectionAutorefreshTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.section.autorefresh.SectionAutorefreshTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.String"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.section.autorefresh.SectionAutorefresh",
            data : {
                selected : []
            }
        });

        this.defaultTestTimeout = 60000;
    },
    $prototype : {
        runTemplateTest : function () {
            var tpl = this.templateCtxt;

            // Add a value in the datamodel
            aria.utils.Json.add(tpl.data.selected, "one");
            aria.utils.Json.add(tpl.data.selected, "two");
            // Each of them should have triggered a refresh of the section

            // Verify the content of the section
            var div = aria.utils.Dom.getElementById("container");
            var text = div.innerHTML.toLowerCase();
            text = text.replace(/\s+/g, "");

            this.assertEquals(text, "onetwo", "Expected onetwo, got " + text);

            this.notifyTemplateTestEnd();
        }
    }
});
