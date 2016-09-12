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
    $classpath : "test.aria.widgets.autoselect.programmatic.AutoSelect",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Type"],
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus("field");

            aria.core.Timer.addCallback({
                fn : this.onFocus,
                scope : this,
                delay : 50
            });
        },

        onFocus : function () {
            try {
                var field = this.getInputField("field");
                var length = field.value.length;

                if (aria.utils.Type.isNumber(field.selectionStart)) {
                    this.assertEquals(field.selectionStart, 0, "Selection start should be on 0, got "
                            + field.selectionStart);
                    this.assertEquals(field.selectionEnd, length, "Selection end should be on " + length + ", got "
                            + field.selectionEnd);
                }
            } catch (ex) {}

            this.end();
        }
    }
});
