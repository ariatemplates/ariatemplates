/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : 'test.aria.templates.issue1319.TplDefinitionChangedTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.issue1319.TplDefinitionChanged"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var tplDef = test.aria.templates.issue1319.TplDefinitionChanged.classDefinition;
            var tplScriptDef = test.aria.templates.issue1319.TplDefinitionChangedScript.classDefinition;
            var tpl = this.templateCtxt._tpl;

            // Defined in the template script:
            this.assertJsonEquals(tplScriptDef.$resources, {
                dateRes : "aria.resources.DateRes"
            });
            this.assertJsonEquals(tplScriptDef.$texts, {
                classTpl : "aria.ext.filesgenerator.tpl.Class"
            });

            // Defined in the template:
            this.assertJsonEquals(tplDef.$resources, {
                calendarRes : "aria.resources.CalendarRes"
            });
            this.assertJsonEquals(tplDef.$texts, {
                bootstrapTpl : "aria.ext.filesgenerator.tpl.Bootstrap"
            });

            // The template prototype has everything:
            this.assertJsonEquals(tpl.$resources, {
                calendarRes : "aria.resources.CalendarRes",
                dateRes : "aria.resources.DateRes"
            });
            this.assertJsonEquals(tpl.$texts, {
                bootstrapTpl : "aria.ext.filesgenerator.tpl.Bootstrap",
                classTpl : "aria.ext.filesgenerator.tpl.Class"
            });
            this.assertEquals(tpl.calendarRes, aria.resources.CalendarRes);
            this.assertEquals(tpl.dateRes, aria.resources.DateRes);
            this.assertEquals(tpl.bootstrapTpl, aria.ext.filesgenerator.tpl.Bootstrap);
            this.assertEquals(tpl.classTpl, aria.ext.filesgenerator.tpl.Class);

            this.end();
        }
    }
});
