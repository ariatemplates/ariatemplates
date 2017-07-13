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
 * Base test class that implements some basic methods
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.MovableDialogBaseTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.json = aria.utils.Json;
    },
    $prototype : {

        /**
         * Load dialog-specific test utilities
         */
        runTemplateTest : function () {

            this.testWindow.Aria.load({
                classes : ["aria.utils.Dom", "test.aria.utils.overlay.loadingIndicator.IndicatorHelper"],
                oncomplete : {
                    fn : this._afterSpecificDepsLoad,
                    scope : this
                }
            });

        },

        /**
         * Start the actual test
         * @protected
         */
        _afterSpecificDepsLoad : function () {
            this.domUtil = this.testWindow.aria.utils.Dom;
            this.indHelper = this.testWindow.test.aria.utils.overlay.loadingIndicator.IndicatorHelper;
            this.startDialogTest();
        },

        /**
         * Check that the overlay of a section is correctly displayed
         * @param {String} sectionId
         */
        __checkOverlayOnSection : function (sectionId) {
            var domUtil = this.domUtil;
            var loadingIndUtil = this.indHelper;
            var section = this.getElementById(sectionId, true);
            var overlay = loadingIndUtil.getOverlay(section).overlay.overlay;
            var sectionGeo = domUtil.getGeometry(section);
            var overlayGeo = domUtil.getGeometry(overlay);
            var sectionZIndex = this.computeZIndex(section);
            var overlayZIndex = this.computeZIndex(overlay);
            this.assertJsonEquals(sectionGeo, overlayGeo, "The overlay was not positioned correctly on section "
                    + sectionId + ".");
            this.assertTrue(overlayZIndex >= sectionZIndex, "The overlay is behind the corresponding element.");
        },

        /**
         * Test the positioning of the dialog and the datamodel update
         * @param {Object} args Contains:
         *
         * <pre>
         * dataHolder : data
         * container in which the xpos and ypos values are stored
         * testValues: contains the reference left and top values. If width and height is found instead, then left and top will be computed by cenetering an element with those sizes
         * dialog: the html element corresponding to the dialog
         * </pre>
         */
        _testPositioning : function (args) {
            args = args || this.testPosArgs;
            var dialog = args.dialog, dataHolder = args.dataHolder;
            var domUtil = this.domUtil;
            var tolerance = args.tolerance || 1;
            var left, top, pos, centered;
            if ("left" in args.testValues) {
                left = args.testValues.left;
                top = args.testValues.top;
            } else {
                centered = domUtil.centerInViewport({
                    width : args.testValues.width,
                    height : args.testValues.height
                });
                left = centered.left;
                top = centered.top;
            }
            if (dataHolder) {
                if (dataHolder.xpos > 0) {
                    this.assertTrue(Math.abs(dataHolder.xpos - left) <= tolerance, "xpos is not correctly updated in the data model");
                }
                if (dataHolder.ypos > 0) {
                    this.assertTrue(Math.abs(dataHolder.ypos - top) <= tolerance, "ypos is not correctly updated in the data model");
                }
            }
            if (dialog) {
                pos = domUtil.calculatePosition(dialog);
                if (pos.left > 0) {
                    this.assertTrue(Math.abs(pos.left - left) <= tolerance, "wrong horizontal position for dialog");
                }
                if (pos.top > 0) {
                    this.assertTrue(Math.abs(pos.top - top) <= tolerance, "wrong vertical position for dialog");
                }
            }
            if (args.sectionOverlay) {
                this.__checkOverlayOnSection(args.sectionOverlay);
            }
        },

        /**
         * @param {Object} geometry contains left, top, width and height
         * @return {aria.utils.DomBeans.Position}
         */
        _fitInViewport : function (geometry) {
            var dom = this.domUtil;
            return dom.fitInViewport({
                left : geometry.left,
                top : geometry.top
            }, {
                width : geometry.width,
                height : geometry.width
            });
        }
    }
});
