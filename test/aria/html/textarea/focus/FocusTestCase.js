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
    $classpath : "test.aria.html.textarea.focus.FocusTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus("focusable");
            aria.core.Timer.addCallback({
                fn : this._afterFocus,
                scope : this,
                delay : 100
            });
        },

        _afterFocus : function (_, element) {
            element = Aria.$window.document.getElementsByTagName("textarea")[0];

            var active = Aria.$window.document.activeElement;
            this.assertTrue(element === active, "$focus method failed.");

            this.end();
        }
    }
});
