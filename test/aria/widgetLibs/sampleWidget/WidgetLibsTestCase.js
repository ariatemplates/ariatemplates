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

/**
 * Testcase for widget libraries
 */
Aria.classDefinition({
    $classpath : "test.aria.widgetLibs.sampleWidget.WidgetLibsTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        setUp : function () {
            aria.core.AppEnvironment.setEnvironment({});
            aria.core.AppEnvironment.setEnvironment({
                defaultWidgetLibs : {
                    "libB" : "test.aria.widgetLibs.sampleWidget.test.SampleWidgetLib"
                }
            });
        },

        tearDown : function () {
            aria.core.AppEnvironment.setEnvironment({});
        },

        runTemplateTest : function () {
            var domElt = this.templateCtxt.getContainerDiv();
            var content = domElt.innerHTML;
            content = content.replace(/<[^>]*>/g, ""); // remove tags
            this.assertTrue(content == "abcdefghijklmno", "Custom widgets did not generate correct markup.");
            this.notifyTemplateTestEnd();
        }
    }
});
