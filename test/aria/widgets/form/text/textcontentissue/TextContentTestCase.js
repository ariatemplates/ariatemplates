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
    $classpath : "test.aria.widgets.form.text.textcontentissue.TextContentTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            name : "This is an example text"
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.text.textcontentissue.TextContentTpl",
            data : this.data
        });

    },
    $prototype : {

        runTemplateTest : function () {

            var widget = this.getWidgetInstance("textwidgetid");
            this.assertEquals(widget.textContent, "This is an example text", "Text should be %2, got %1");
            aria.utils.Json.setValue(this.templateCtxt.data, "name", "This is another text");
            this.assertEquals(widget.textContent, "This is another text", "Text should be %2, got %1");
            this.end();

        }

    }
});
