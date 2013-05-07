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
    $classpath : "test.aria.templates.css.cssMgr.CSSMgrTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.CSSMgr"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.css.cssMgr.Big"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            // The template simply tries to load a CSS style with more than 4000 rules
            // check that there is an error in the logs

            // Call a refresh
            this.assertErrorInLogs(aria.templates.CSSMgr.CSSTEMPLATE_MAX_SELECTORS_REACHED);

            this.notifyTemplateTestEnd();
        }
    }
});
