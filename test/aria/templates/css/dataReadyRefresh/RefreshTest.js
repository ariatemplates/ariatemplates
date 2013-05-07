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
    $classpath : "test.aria.templates.css.dataReadyRefresh.RefreshTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.css.dataReadyRefresh.RefreshTestTemplate",
            moduleCtrl : {
                classpath : "test.aria.templates.css.dataReadyRefresh.RefreshModuleCtrl"
            }
        });
    },
    $prototype : {
        // This tests what happens to the CSS when a refresh on the parent template is called during the
        // dataReady of a child template)
        // This is what is done in the doc center
        runTemplateTest : function () {
            var myDiv = aria.utils.Dom.getElementById("myDiv");
            var fontSize = aria.utils.Dom.getStyle(myDiv, "fontSize");
            this.assertTrue(fontSize == "48px");
            this.notifyTemplateTestEnd();
        }
    }
});
