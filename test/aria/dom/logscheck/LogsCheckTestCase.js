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
 * Check that error in template does not break application
 * @class test.aria.dom.logscheck.LogsCheckTestCase
 */
Aria.classDefinition({
    $classpath : "test.aria.dom.logscheck.LogsCheckTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.dom.logscheck.LogsCheck"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.assertErrorInLogs(aria.templates.TemplateCtxt.DATA_READY_EXCEPTION, "Missing error in log: DATA_READY_EXCEPTION");
            this.assertErrorInLogs(aria.templates.TemplateCtxt.VIEW_READY_EXCEPTION, "Missing error in log: VIEW_READY_EXCEPTION");
            this.assertErrorInLogs(aria.templates.TemplateCtxt.DISPLAY_READY_EXCEPTION, "Missing error in log: DISPLAY_READY_EXCEPTION");

            // this shall not fail on IE
            var hiddenTarget = this.templateCtxt.$getElementById('target');
            hiddenTarget.focus();

            this.templateCtxt.$refresh();
            this.assertErrorInLogs(aria.templates.TemplateCtxt.BEFORE_REFRESH_EXCEPTION, "Missing error in log: BEFORE_REFRESH_EXCEPTION");
            this.assertErrorInLogs(aria.templates.TemplateCtxt.AFTER_REFRESH_EXCEPTION, "Missing error in log: AFTER_REFRESH_EXCEPTION");
            this.assertErrorInLogs(aria.templates.TemplateCtxt.DISPLAY_READY_EXCEPTION, "Missing error in log: DISPLAY_READY_EXCEPTION");

            // errors not catch will result in test timeout
            this.notifyTemplateTestEnd();
        }
    }
});
