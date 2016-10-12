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
 * Test case for aria.widgets.container.Dialog
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.sizes.HeightConstraintsTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        // keep in sync with maxHeight in TPL
        this.MAX_HEIGHT = 400;
        this.MIN_HEIGHT = 150;
        this.INITIAL_NUMBER_OF_LINES = 10;

        this.data = {
            dialogNoOfLines : this.INITIAL_NUMBER_OF_LINES
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.sizes.HeightConstraintsTestCaseTpl",
            data : this.data
        });

        this.widgetUnderTestId = "dialogWithConstraints";
    },
    $prototype : {
        runTemplateTest : function () {
            this._testInitialSize();
            this._testExpandingBeyondMax();
            this._testFurtherExpanding();
            this._testShrinkingToInitial();
            this._testShrinkingBelowMin();
            this._testShrinkingEvenFurther();
            this.finish();
        },

        _testInitialSize : function () {
            // initially, the dialog has moderate number of lines and the height is automatic, between the min height
            // and max height (can be several pixels difference between various browsers)
            var h = this.__getDialogHeight();
            this._initialHeight = h; // store for a later checkup
            this.assertTrue(this.MIN_HEIGHT < h && h < this.MAX_HEIGHT, "Initial height should be between min and max");
        },

        _testExpandingBeyondMax : function () {
            // after putting too many lines, we should not exceed MAX_HEIGHT
            aria.utils.Json.setValue(this.data, "dialogNoOfLines", 50);
            this.assertEquals(this.__getDialogHeight(), this.MAX_HEIGHT);
        },

        _testFurtherExpanding : function () {
            // when in MAX_HEIGHT, increasing the contents further, should not change the height
            aria.utils.Json.setValue(this.data, "dialogNoOfLines", 80);
            this.assertEquals(this.__getDialogHeight(), this.MAX_HEIGHT);
        },

        _testShrinkingToInitial : function () {
            // when returning to the initial contents, we should get the same height
            aria.utils.Json.setValue(this.data, "dialogNoOfLines", this.INITIAL_NUMBER_OF_LINES);
            var h = this.__getDialogHeight();
            this.assertEquals(h, this._initialHeight, "Expected to shrink to initial (%2) but got %1 after shrinking");
        },

        _testShrinkingBelowMin : function () {
            // set very small number of lines, we should not shrink below MIN_HEIGHT
            aria.utils.Json.setValue(this.data, "dialogNoOfLines", 3);
            this.assertEquals(this.__getDialogHeight(), this.MIN_HEIGHT);
        },

        _testShrinkingEvenFurther : function () {
            // while in MIN_HEIGHT, reduce number of lines further; height should not change
            aria.utils.Json.setValue(this.data, "dialogNoOfLines", 1);
            this.assertEquals(this.__getDialogHeight(), this.MIN_HEIGHT);
        },

        finish : function () {
            this.notifyTemplateTestEnd();
        },

        __getDialogHeight : function () {
            var container = this.getWidgetInstance(this.widgetUnderTestId);
            var geometry = aria.utils.Dom.getGeometry(container.getDom());
            return geometry.height;
        }
    }
});
