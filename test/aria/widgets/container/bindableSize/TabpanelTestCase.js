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
 * Test case for aria.widgets.container.TabPanel
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.bindableSize.TabpanelTestCase",
    $extends : "test.aria.widgets.container.bindableSize.shared.BindableSizeBase",
    $constructor : function () {
        this._tplClasspath = "test.aria.widgets.container.bindableSize.TabpanelTestCaseTpl";
        this.$BindableSizeBase.constructor.call(this);
    },
    $prototype : {
        /**
         * @override
         */
        _testNoConstraints : function () {
            this._widgetUnderTestId = 'tpNoConstraints';
            this._widgetUnderTestToggleVisibility = false;
            this._testNoConstraintsStart();
        },

        /**
         * @override
         */
        _testWithConstraints : function () {
            this._widgetUnderTestId = 'tpWithConstraints';
            this._widgetUnderTestToggleVisibility = false;
            this._testWithConstraintsStart();
        }
    }
});
