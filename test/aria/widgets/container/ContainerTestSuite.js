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
    $classpath : "test.aria.widgets.container.ContainerTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.container.DivTest");
        this.addTests("test.aria.widgets.container.FieldsetTest");
        this.addTests("test.aria.widgets.container.splitter.SplitterTest");
        this.addTests("test.aria.widgets.container.splitter.move.SplitterTestMoveUpDown");
        this.addTests("test.aria.widgets.container.splitter.move.SplitterTestMoveLeftRight");
        this.addTests("test.aria.widgets.container.splitter.skin.SplitterBorderWidthTest");
        this.addTests("test.aria.widgets.container.splitter.skin.border.BordersAndSizesTest");
        this.addTests("test.aria.widgets.container.tooltip.TooltipTestCase");
        this.addTests("test.aria.widgets.container.dialog.DialogTestSuite");
        this.addTests("test.aria.widgets.container.bindableSize.BindableSizeTestSuite");
        this.addTests("test.aria.widgets.container.dialog.movable.issue367.MovableDialogTestCase");
        this.addTests("test.aria.widgets.container.checkContent.DivTest");
        this.addTests("test.aria.widgets.container.tabpanel.TabPanelTest");
    }
});
