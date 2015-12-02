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
    $classpath : "test.aria.widgets.container.dialog.DialogTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.container.dialog.maximizable.MaximizableDialogTest");
        this.addTests("test.aria.widgets.container.dialog.closeOutside.Issue389TestCase");
        this.addTests("test.aria.widgets.container.dialog.MovableDialogTestSuite");
        this.addTests("test.aria.widgets.container.dialog.closeOrDrag.CloseOrDragTest");

        this.addTests("test.aria.widgets.container.dialog.resize.DialogResizeTestSuite");
        this.addTests("test.aria.widgets.container.dialog.closeOnClick.CloseDialogOnClickTestCase");
        this.addTests("test.aria.widgets.container.dialog.onCloseCallback.OnCloseCallbackTestCase");
        this.addTests("test.aria.widgets.container.dialog.sizes.DialogSizesTestSuite");
        this.addTests("test.aria.widgets.container.dialog.scroll.SetScrollTestCase");
        this.addTests("test.aria.widgets.container.dialog.scroll.OnScrollTestCase");
        this.addTests("test.aria.widgets.container.dialog.focus.FocusInsideModalDialog");

        this.addTests("test.aria.widgets.container.dialog.checkStyle.DialogTestCase");
        this.addTests("test.aria.widgets.container.dialog.escKey.DialogTemplateTestCase");
        this.addTests("test.aria.widgets.container.dialog.escKey.multipleDialogs.EscapeOnModalTest");
        this.addTests("test.aria.widgets.container.dialog.escKey.multipleDialogs.EscapeOnModalAndNonModalTest");
        this.addTests("test.aria.widgets.container.dialog.indicators.DialogTestCase");
        this.addTests("test.aria.widgets.container.dialog.keymap.DialogTestCase");
        this.addTests("test.aria.widgets.container.dialog.missingMacro.DialogTestCase");
        this.addTests("test.aria.widgets.container.dialog.wrongCfg.ValidationTest");
        this.addTests("test.aria.widgets.container.dialog.configContainer.DialogTestCase");
        this.addTests("test.aria.widgets.container.dialog.container.DialogContainerTestSuite");
        this.addTests("test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexTestSuite");
    }
});
