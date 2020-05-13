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
    $classpath: "test.aria.templates.statements.escape.packageOverride.PackageOverrideBase",
    $extends: "aria.jsunit.TemplateTestCase",
    $constructor: function () {
        this.$TemplateTestCase.constructor.call(this, arguments);
        this.setTestEnv({
            template: "test.aria.templates.statements.escape.packageOverride.AutoEscapeDefault"
        });
    },
    $prototype: {
        environmentDefaultValue: undefined,
        environmentPerPackage: undefined,
        expectedHtml: '',

        setUp : function () {
            aria.core.AppEnvironment.setEnvironment({
                "templateSettings" : {
                    "escapeHtmlByDefault" : this.environmentDefaultValue,
                    "escapeHtmlByDefaultPerPackage": this.environmentPerPackage
                }
            }, null, true);
        },

        runTemplateTest: function() {
            var actualHtml = this.getElementById('myitem').innerHTML;
            this.assertEquals(actualHtml, this.expectedHtml);
            this.end();
        }
    }
});
