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

/**
 * Test case for test.aria.widgets.icon.fontIcon.FontIconTest
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.icon.fontIcon.FontIconTest",
    $dependencies : ["aria.widgets.Icon"],
    $extends : "aria.jsunit.WidgetTestCase",
    $prototype : {
        /**
         * Helper to destroy an icon
         * @param {Object} inst
         */
        _destroyIcon : function (inst) {
            inst.$dispose();
            this.outObj.clearAll();
        },

        /**
         * Test base layout
         */
        testAsyncFontIconTest : function () {
            var cfg = {
                icon : "std:camera-retro"
            };
            var instance = new aria.widgets.Icon(cfg, this.outObj.tplCtxt);
            instance.writeMarkup(this.outObj);
            this.outObj.putInDOM();
            // init widget
            instance.initWidget();

            var classList = instance.getDom().classList.toString();
            this.assertTrue(classList.search('fa fa-camera-retro') !== -1, 'The css classes were not added to the icon');
            this._destroyIcon(instance);
            this.notifyTestEnd("testAsyncFontIconTest");
        }
    }
});
