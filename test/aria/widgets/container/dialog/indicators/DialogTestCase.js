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
    $classpath : "test.aria.widgets.container.dialog.indicators.DialogTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["test.aria.utils.overlay.loadingIndicator.IndicatorHelper"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            processing : true,
            secondProcessing : false,
            visible : true,
            secondVisible : false,
            thirdVisible : false
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.indicators.DialogTestTemplate",
            data : this.data
        });
        this.__indHelper = test.aria.utils.overlay.loadingIndicator.IndicatorHelper;
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this.__callback,
                scope : this,
                delay : 500
            });

        },
        __checkOverlayOnSection : function (sectionId) {
            var section = this.getElementById(sectionId, true);
            var overlay = this.__indHelper.getOverlay(section).overlay.overlay;
            var domUtil = aria.utils.Dom;
            var sectionGeo = domUtil.getGeometry(section);
            var overlayGeo = domUtil.getGeometry(overlay);
            var sectionZIndex = this.computeZIndex(section);
            var overlayZIndex = this.computeZIndex(overlay);
            this.assertJsonEquals(sectionGeo, overlayGeo, "The overlay was not positioned correctly on section "
                    + sectionId + ".");
            this.assertTrue(overlayZIndex > sectionZIndex, "The overlay is behind the corresponding element.");

        },
        __callback : function (cb) {

            // test the correct display of the overlay when you have a section in the dialog
            this.__checkOverlayOnSection("testSection");
            aria.utils.Json.setValue(this.data, "visible", false);
            aria.core.Timer.addCallback({
                fn : this.__secondCallback,
                scope : this,
                delay : 500
            });

        },
        __secondCallback : function () {
            // test that the overlay is correctly disposed and that the value to which the processing is bound is not
            // overridden
            this.assertTrue(this.data.processing, "The processing bound has been changed when removing the section");
            var overlayCount = this.__indHelper.countInDom();
            this.assertTrue(overlayCount === 0, "The overlay has not been removed.");

            // Redisplay the dialog to check once again that teh overlay is displayed and disposed correctly
            aria.utils.Json.setValue(this.data, "visible", true);

            aria.core.Timer.addCallback({
                fn : this.__thirdCallback,
                scope : this,
                delay : 500
            });

        },

        __thirdCallback : function () {
            this.__checkOverlayOnSection("testSection");

            aria.utils.Json.setValue(this.data, "visible", false);
            aria.core.Timer.addCallback({
                fn : this.__fourthCallback,
                scope : this,
                delay : 500
            });
        },

        __fourthCallback : function () {
            this.assertTrue(this.data.processing, "The processing bound has been changed when removing the section");
            var overlayCount = this.__indHelper.countInDom();
            this.assertTrue(overlayCount === 0, "The overlay has not been removed.");

            // test the case in which the section is in a sub-template
            aria.utils.Json.setValue(this.data, "secondVisible", true);
            aria.core.Timer.addCallback({
                fn : this.__fifthCallback,
                scope : this,
                delay : 500
            });
        },

        __fifthCallback : function () {
            this.__checkOverlayOnSection("testSubSection");
            aria.utils.Json.setValue(this.data, "secondVisible", false);

            this.assertTrue(this.data.processing, "The processing bound has been changed when removing the section");
            var overlayCount = this.__indHelper.countInDom();
            this.assertTrue(overlayCount === 0, "The overlay has not been removed.");

            aria.utils.Json.setValue(this.data, "secondVisible", true);
            this.__checkOverlayOnSection("testSubSection");
            aria.utils.Json.setValue(this.data, "secondVisible", false);

            this.assertTrue(this.data.processing, "The processing bound has been changed when removing the section");
            var overlayCount = this.__indHelper.countInDom();
            this.assertTrue(overlayCount === 0, "The overlay has not been removed.");

            // Test the case in which the section is inside a div widget
            aria.utils.Json.setValue(this.data, "thirdVisible", true);
            this.__checkOverlayOnSection("testDivSection");

            aria.utils.Json.setValue(this.data, "thirdVisible", false);
            this.assertTrue(this.data.processing, "The processing bound has been changed when removing the section");
            var overlayCount = this.__indHelper.countInDom();
            this.assertTrue(overlayCount === 0, "The overlay has not been removed.");

            // check that the removal of a section also triggers the removal of its processing indicator
            aria.utils.Json.setValue(this.data, "secondProcessing", true);
            this.__checkOverlayOnSection("testMainSection");
            var section = this.templateCtxt.$getElementById("testMainSection");
            section.remove();
            this.assertTrue(this.data.processing, "The processing bound has been changed when removing the section");
            var overlayCount = this.__indHelper.countInDom();
            this.assertTrue(overlayCount === 0, "The overlay has not been removed.");

            this.end();
        }
    }
});
