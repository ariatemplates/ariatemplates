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
    $classpath : "test.aria.html.textarea.TextAreaTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.html.textarea.TextAreaTestCase");
        this.addTests("test.aria.html.textarea.TextAreaOnTypeTestCase");
        this.addTests("test.aria.html.textarea.focus.FocusTestCase");
        this.addTests("test.aria.html.textarea.autoselect.AutoselectRobotTestCase");
        this.addTests("test.aria.html.textarea.bind.BindableRobotTestCase");
        this.addTests("test.aria.html.textarea.bind.TextAreaBindTestCase");
        this.addTests("test.aria.html.textarea.DisabledTextAreaTestCase");
    }
});
