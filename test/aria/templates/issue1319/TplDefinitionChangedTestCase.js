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
    $dependencies : ['aria.utils.Object'],
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
            this.assertJsonEquals(aria.utils.Object.keys(tplDef.$resources), ["calendarRes"]);
            this.assertEquals(Aria.getClasspath(tplDef.$resources.calendarRes), "aria.resources.CalendarRes");
            this.assertJsonEquals(aria.utils.Object.keys(tplDef.$texts), ["bootstrapTpl"]);
            this.assertEquals(Aria.getClasspath(tplDef.$texts.bootstrapTpl), "aria.ext.filesgenerator.tpl.Bootstrap");

            // The template prototype has everything:
            this.assertJsonEquals(aria.utils.Object.keys(tpl.$resources).sort(), ["calendarRes", "dateRes"]);
            this.assertEquals(Aria.getClasspath(tpl.$resources.calendarRes), "aria.resources.CalendarRes");
            this.assertEquals(Aria.getClasspath(tpl.$resources.dateRes), "aria.resources.DateRes");
            this.assertJsonEquals(aria.utils.Object.keys(tpl.$texts).sort(), ["bootstrapTpl", "classTpl"]);
            this.assertEquals(Aria.getClasspath(tpl.$texts.bootstrapTpl), "aria.ext.filesgenerator.tpl.Bootstrap");
            this.assertEquals(Aria.getClasspath(tpl.$texts.classTpl), "aria.ext.filesgenerator.tpl.Class");
            this.assertEquals(tpl.calendarRes, aria.resources.CalendarRes);
            this.assertEquals(tpl.dateRes, aria.resources.DateRes);
            this.assertEquals(tpl.bootstrapTpl, aria.ext.filesgenerator.tpl.Bootstrap);
            this.assertEquals(tpl.classTpl, aria.ext.filesgenerator.tpl.Class);

            this.end();
        }
    }
});
