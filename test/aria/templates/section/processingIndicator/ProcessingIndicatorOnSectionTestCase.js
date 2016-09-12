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
 * Test that the loading indicator follows the section
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.section.processingIndicator.ProcessingIndicatorOnSection",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["test.aria.utils.overlay.loadingIndicator.IndicatorHelper", "aria.utils.Json", "aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            visible : true,
            xpos : 0,
            ypos : 0
        };

        this.setTestEnv({
            data : this.data
        });

        this._indHelper = test.aria.utils.overlay.loadingIndicator.IndicatorHelper;
        this._json = aria.utils.Json;
    },
    $prototype : {

        runTemplateTest : function () {
            this.assertEquals(this._indHelper.totalOverlays(), 0);

            // create explicitly an overlay
            this.templateCtxt.$getElementById("testSectionInDialog").setProcessingIndicator(true);
            this.assertEquals(this._indHelper.totalOverlays(), 1);
            this.__checkOverlayOnSection("testSectionInDialog");

            // move the section
            this._json.setValue(this.data, "xpos", 50);
            this.__checkOverlayOnSection("testSectionInDialog");

            // destroy the section
            this._json.setValue(this.data, "visible", false);
            this.assertEquals(this._indHelper.totalOverlays(), 0);

            // recreate the section and check that the lack of binding prevents the redesplay of the loading indicator
            this._json.setValue(this.data, "visible", true);
            this.assertEquals(this._indHelper.totalOverlays(), 0);

            // check that the status of the overaly can be changed on the wrapper
            this.templateCtxt.$getElementById("testSectionInDialog").setProcessingIndicator(true);
            this.assertEquals(this._indHelper.totalOverlays(), 1);
            this.__checkOverlayOnSection("testSectionInDialog");
            this.templateCtxt.$getElementById("testSectionInDialog").setProcessingIndicator(false);
            this.assertEquals(this._indHelper.totalOverlays(), 0);
            this._json.setValue(this.data, "xpos", 25);
            this.assertEquals(this._indHelper.totalOverlays(), 0);

            // check that the refresh of the section makes the overlay stay
            this.templateCtxt.$getElementById("testSectionInDialog").setProcessingIndicator(true);
            this.assertEquals(this._indHelper.totalOverlays(), 1);
            this.__checkOverlayOnSection("testSectionInDialog");
            this.templateCtxt.$refresh({
                section : "testSectionInDialog"
            });
            this.assertEquals(this._indHelper.totalOverlays(), 1);
            this.__checkOverlayOnSection("testSectionInDialog");

            aria.core.Timer.addCallback({
                fn : this._finishTest,
                scope : this,
                delay : 100
            });
        },

        _finishTest : function () {
            // check that the refresh of the container makes the overlay disapper
            this.templateCtxt.$refresh();
            this.assertEquals(this._indHelper.totalOverlays(), 0);
            this.end();
        },

        __checkOverlayOnSection : function (sectionId) {
            var section = this.getElementById(sectionId, true);
            var overlay = this._indHelper.getOverlay(section).overlay.overlay;
            var domUtil = aria.utils.Dom;
            var sectionGeo = domUtil.getGeometry(section);
            var overlayGeo = domUtil.getGeometry(overlay);
            var sectionZIndex = this.computeZIndex(section);
            var overlayZIndex = this.computeZIndex(overlay);
            this.assertJsonEquals(sectionGeo, overlayGeo, "The overlay was not positioned correctly on section "
                    + sectionId + ".");
            this.assertTrue(overlayZIndex > sectionZIndex, "The overlay is behind the corresponding element.");

        }

    }
});
