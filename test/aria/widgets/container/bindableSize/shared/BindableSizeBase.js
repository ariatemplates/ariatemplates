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

/**
 * Generic test case class to check if constraints are preserved when the size is bindable. Usage: inherit from this
 * class and override the methods _testNoConstraints and _testWithConstraints with your test code.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.bindableSize.shared.BindableSizeTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        /**
         * Used to check if the subclass passed all the necessary config variables.
         */
        this._isTestCfgValid = true;

        // keep the values below in sync with the config of the widgets with constraints in TPLs
        this.MIN_WIDTH = 111;
        this.MIN_HEIGHT = 111;

        this.DEFAULT_WIDTH = 200;
        this.DEFAULT_HEIGHT = 200;

        this.MAX_WIDTH = 333;
        this.MAX_HEIGHT = 333;

        this.data = {
            width : this.DEFAULT_WIDTH,
            height : this.DEFAULT_HEIGHT,
            visible : { // only for dialog tests
                dialogNoConstraints : false,
                dialogWithConstraints : false
            },
            selectedTabId : "tab1" // only for tabpanel tests
        };

        // setTestEnv has to be invoked before runTemplateTest fires
        if (this._tplClasspath) {
            this.setTestEnv({
                template : this._tplClasspath,
                data : this.data
            });
        } else {
            this._isTestCfgValid = false;
        }

        this._widgetUnderTestId = null;
        this._widgetUnderTestToggleVisibility = false;
    },
    $prototype : {

        runTemplateTest : function () {
            this.assertTrue(this._isTestCfgValid, "Invalid test configuration. The subclass didn't provide _tplClasspath value.");

            this._testNoConstraints();
            this._testWithConstraints();

            this.finish();
        },

        /* override me in the subclass */
        _testNoConstraints : function () {},

        /* override me in the subclass */
        _testWithConstraints : function () {},

        _testNoConstraintsStart : function () {

            // no constraints on the dialog -> each width/height change should be reflected
            if (this._widgetUnderTestToggleVisibility) {
                aria.utils.Json.setValue(this.data.visible, this._widgetUnderTestId, true);
            }

            this.__checkGeometry(this._widgetUnderTestId, this.DEFAULT_WIDTH, this.DEFAULT_HEIGHT);

            this.__setWidthAndHeight(this.MAX_WIDTH + 20, this.MAX_HEIGHT + 20);
            this.__checkGeometry(this._widgetUnderTestId, this.MAX_WIDTH + 20, this.MAX_HEIGHT + 20);

            this.__setWidthAndHeight(this.MIN_WIDTH - 20, this.MIN_WIDTH - 20);
            this.__checkGeometry(this._widgetUnderTestId, this.MIN_WIDTH - 20, this.MIN_WIDTH - 20);

            if (this._widgetUnderTestToggleVisibility) {
                aria.utils.Json.setValue(this.data.visible, this._widgetUnderTestId, false);
            }
        },

        _testWithConstraintsStart : function () {
            // let's check what happens if we put values lower than minWidth/minHeight into
            // data model before the dialog is shown for the first time
            // the values should be actually changed to minWidth/minHeight
            this.__setWidthAndHeight(this.MIN_WIDTH - 20, this.MIN_HEIGHT - 20);
            if (this._widgetUnderTestToggleVisibility) {
                aria.utils.Json.setValue(this.data.visible, this._widgetUnderTestId, true);
            }
            this.__checkGeometry(this._widgetUnderTestId, this.MIN_WIDTH, this.MIN_HEIGHT);

            // now let's increase the value to exceed the maxWidth/maxHeight...
            // the values should be changed to maxWidth/maxHeight
            this.__setWidthAndHeight(this.MAX_WIDTH + 20, this.MAX_HEIGHT + 20);
            this.__checkGeometry(this._widgetUnderTestId, this.MAX_WIDTH, this.MAX_HEIGHT);

            // let's set valid values; they should be unchanged
            var acceptedWidth = Math.floor((this.MAX_WIDTH - this.MIN_WIDTH) / 2);
            var acceptedHeight = Math.floor((this.MAX_HEIGHT - this.MIN_HEIGHT) / 2);
            this.__setWidthAndHeight(acceptedWidth, acceptedHeight);
            this.__checkGeometry(this._widgetUnderTestId, acceptedWidth, acceptedHeight);

            if (this._widgetUnderTestToggleVisibility) {
                aria.utils.Json.setValue(this.data.visible, this._widgetUnderTestId, false);
            }
        },

        finish : function () {
            this.notifyTemplateTestEnd();
        },

        __reset : function () {
            this.__setWidthAndHeight(this.DEFAULT_WIDTH, this.DEFAULT_WIDTH);
        },

        __setWidthAndHeight : function (width, height) {
            aria.templates.RefreshManager.stop();
            aria.utils.Json.setValue(this.data, 'width', width);
            aria.utils.Json.setValue(this.data, 'height', height);
            aria.templates.RefreshManager.resume();
        },

        __checkGeometry : function (widgetId, expectedWidth, expectedHeight) {
            var container = this.getWidgetInstance(widgetId);
            var geometry = aria.utils.Dom.getGeometry(container.getDom());
            var wut = this._widgetUnderTestId;

            this.assertEquals(geometry.width, expectedWidth, 'Expected width of ' + wut + ' was %2, but got %1');
            this.assertEquals(geometry.height, expectedHeight, 'Expected height of ' + wut + ' was %2, but got %1.');
        }
    }
});
