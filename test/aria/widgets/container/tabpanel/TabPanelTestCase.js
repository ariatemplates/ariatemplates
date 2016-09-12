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
    $classpath : "test.aria.widgets.container.tabpanel.TabPanelTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.$constructor.apply(this, arguments);
        this.data = {
            tab : "a"
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.assertErrorInLogs(this.testWindow.aria.widgets.container.Container.INVALID_USAGE_AS_CONTAINER, 1);
            this.assertErrorInLogs(aria.core.JsonValidator.INVALID_CONFIGURATION, 1);
            // check that the content inside the TabPanel used as a container has not been output
            this.assertNull(this.testDiv.innerHTML.match(/cccccc/));

            // check that bindings work
            this.assertTrue(!!this.testDiv.innerHTML.match(/aaaaaa/));
            this.assertNull(this.testDiv.innerHTML.match(/bbbbbb/));
            aria.utils.Json.setValue(this.data, "tab", "b");
            this.assertNull(this.testDiv.innerHTML.match(/aaaaaa/));
            this.assertTrue(!!this.testDiv.innerHTML.match(/bbbbbb/));

            this.end();
        }
    }
});
