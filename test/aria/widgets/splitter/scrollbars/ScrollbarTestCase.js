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
    $classpath : "test.aria.widgets.splitter.scrollbars.ScrollbarTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            // Test that no scrollbar is displayed on the second xSplitter_std_sMacro (check issue #642)
            // as it can hides the inner ones.
            var els = this.getElementsByClassName(Aria.$window.document.body, "xSplitter_std_sMacro");

            for(var i = 0, ii = els.length; i < ii; i++) {
                var el = els[i];
                this.assertTrue(
                    (el.scrollHeight - el.offsetHeight < 1) && (el.scrollWidth - el.offsetWidth < 1),
                    "Element " + i + "shouldn't have a scrollbar"
                );
            }

            this.notifyTemplateTestEnd();
        }
    }
});