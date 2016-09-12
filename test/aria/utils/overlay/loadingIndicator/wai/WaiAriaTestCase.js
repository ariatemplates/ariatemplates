/*
 * Copyright 2015 Amadeus s.a.s.
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

var Aria = require("ariatemplates/Aria");
var AppEnvironment = require("ariatemplates/core/AppEnvironment");
var liHelper = require("test/aria/utils/overlay/loadingIndicator/IndicatorHelper");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.utils.overlay.loadingIndicator.wai.WaiAriaTestCase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor: function() {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            processing: false
        };
        this.setTestEnv({
            template : "test.aria.utils.overlay.loadingIndicator.wai.WaiAriaTestCaseTpl",
            data : this.data
        });
    },
    $prototype : {
        run : function () {
            AppEnvironment.setEnvironment({
                appSettings: {
                    waiAria: true
                }
            }, {
                scope: this,
                fn: this.$TemplateTestCase.run
            });
        },

        runTemplateTest : function () {
            var sectionDom, labelDom, liveAttr;
            try {
                sectionDom = this.getElementById("waiSection");

                aria.utils.Json.setValue(this.data, "processing", true);

                labelDom = liHelper.getLabelElement(sectionDom);
                liveAttr = labelDom.getAttribute("aria-live");

                this.assertNotNull(liveAttr, "aria-live attribute should exist");
                this.assertEquals(liveAttr, "polite", "aria-live attribute should be set to 'polite'");

                this.notifyTemplateTestEnd();
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }
    }
});
