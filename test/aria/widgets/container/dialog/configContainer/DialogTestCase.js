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
    $classpath : "test.aria.widgets.container.dialog.configContainer.DialogTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            this.assertErrorInLogs(this.testWindow.aria.widgets.container.Container.INVALID_USAGE_AS_CONTAINER, 1);
            this.assertErrorInLogs(this.testWindow.aria.widgets.container.Dialog.MISSING_CONTENT_MACRO, 1);
            // check that the content inside the Dialog used as a container has not been output
            this.assertNull(this.testDiv.innerHTML.match(/a__b__c__d__e/));
            this.end();
        }
    }
});
