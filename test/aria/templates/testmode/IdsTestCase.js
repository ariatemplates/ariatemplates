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
 * Test different API for the section statement
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.testmode.IdsTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {

        Aria.activateTestMode();

        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            data : {}
        });
    },
    $destructor : function () {
        this.$TemplateTestCase.$destructor.call(this);
        this.templateContext = null;
    },
    $prototype : {

        runTemplateTest : function () {
            var domUtils = aria.utils.Dom;
            var getGenId = function (divId) {
                var div = domUtils.getElementById(divId);
                return div.children[0].id;
            };

            var domId = null;

            // Numberfield
            domId = getGenId('numberfield');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);

            // Timefield
            domId = getGenId('timefield');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);

            // Textfield
            domId = getGenId('textfield');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);

            // checkbox
            domId = getGenId('checkbox');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);

            // Radio
            domId = getGenId('radio');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);

            // Button
            domId = getGenId('button');
            this.assertTrue(domUtils.getElementById(domId + '_button') != null);

            // Selectbox
            domId = getGenId('selectbox');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);
            this.assertTrue(domUtils.getElementById(domId + '_dropdown') != null);

            // Selectbox
            domId = getGenId('selectbox1');
            this.assertErrorInLogs(aria.widgets.form.SelectBox.DUPLICATE_VALUE);

            // Link
            domId = getGenId('link');
            this.assertTrue(domUtils.getElementById(domId + '_link') != null);

            // Tab
            domId = getGenId('tab');
            this.assertTrue(domUtils.getElementById(domId + '_Tab1') != null);

            // Datepicker
            domId = getGenId('datepicker');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);
            this.assertTrue(domUtils.getElementById(domId + '_dropdown') != null);

            // Autocomplete
            domId = getGenId('autocomplete');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);

            // Multiselect
            domId = getGenId('multiselect');
            this.assertTrue(domUtils.getElementById(domId + '_input') != null);
            this.assertTrue(domUtils.getElementById(domId + '_dropdown') != null);

            this.notifyTemplateTestEnd();
        }

    }
});
