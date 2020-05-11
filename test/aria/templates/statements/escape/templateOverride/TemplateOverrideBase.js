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
    $classpath: "test.aria.templates.statements.escape.templateOverride.TemplateOverrideBase",
    $extends: "aria.jsunit.TemplateTestCase",
    $dependencies: ["aria.core.environment.Environment"],
    $constructor: function () {
        this.$TemplateTestCase.constructor.call(this, arguments);
        this.setTestEnv({
            template: this.$package + "." + this.testTemplate
        });
    },
    $prototype: {
        testTemplate: '',
        environmentValue: undefined,
        savedEnvironmentValue: undefined,
        expectedHtml: '',

        setUp : function () {
            if (this.environmentValue != null) {
                this.savedEnvironmentValue = aria.core.environment.Environment.hasEscapeHtmlByDefault();
                aria.core.environment.Environment.setEscapeHtmlByDefault(this.environmentValue);
            }
        },

        tearDown : function() {
            if (this.savedEnvironmentValue != null) {
                aria.core.environment.Environment.setEscapeHtmlByDefault(this.savedEnvironmentValue);
            }
        },

        runTemplateTest: function() {
            var actualHtml = this.getElementById('myitem').innerHTML;
            this.assertEquals(actualHtml, this.expectedHtml);
            this.end();
        }
    }
});
