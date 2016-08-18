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
    $classpath : "test.aria.templates.keyboardNavigation.NavigationTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.templates.keyboardNavigation.TableNavTestCase");
        this.addTests("test.aria.templates.keyboardNavigation.KeyMapTestCase");
        this.addTests("test.aria.templates.keyboardNavigation.actionWidgets.ActionWidgetsTest");
        this.addTests("test.aria.templates.keyboardNavigation.enter.EnterTestCase");
        this.addTests("test.aria.templates.keyboardNavigation.bingCompatibility.KeyMapBingCompatibility");
        this.addTests("test.aria.templates.keyboardNavigation.DialogNavTestCase");
        this.addTests("test.aria.templates.keyboardNavigation.dialog.Suite");
    }
});
