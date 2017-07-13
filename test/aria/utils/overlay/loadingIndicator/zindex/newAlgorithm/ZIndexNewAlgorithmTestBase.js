/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath: 'test.aria.utils.overlay.loadingIndicator.zindex.newAlgorithm.ZIndexNewAlgorithmTestBase',
    $extends: 'aria.jsunit.TemplateTestCase',
    $dependencies: ['aria.utils.Json', 'aria.utils.Dom'],

    $constructor: function () {
        this.$TemplateTestCase.constructor.apply(this, arguments);

        this.setTestEnv({
            iframe: true,
            data: this.generateTemplateData()
        });
    },

    $prototype : {
        ////////////////////////////////////////////////////////////////////////
        // Test setup
        ////////////////////////////////////////////////////////////////////////

        generateTemplateData: function () {
            return this.data = {
                coveredElementId: 'coveredElement',
                childElementId: 'childElement',
                showOverlay: false
            };
        },

        // to be overridden
        generateTestData: function () {
            return null;
        },

        runTemplateTest: function () {
            var testData = this.generateTestData();
            if (testData == null) {
                testData = {};
            }

            var overlayShouldBeOnTop = testData.overlayShouldBeOnTop;
            if (overlayShouldBeOnTop == null) {
                overlayShouldBeOnTop = true;
            }

            var expectedZIndex = testData.expectedZIndex;

            this.setOverlay();

            this.assertTopMostElementIsOverlay(overlayShouldBeOnTop);
            this.assertOverlayZIndex(expectedZIndex);

            this.notifyTemplateTestEnd();
        },

        setOverlay: function () {
            aria.utils.Json.setValue(this.data, 'showOverlay', true);

            var style = this.getOverlay().style;
            style.background = 'red'; // for visual debug only
        },


        ////////////////////////////////////////////////////////////////////////
        // Assertion
        ////////////////////////////////////////////////////////////////////////

        assertTopMostElementIsOverlay: function (overlayShouldBeOnTop) {
            var topMostElement = this.getTopMostElement();
            var coveredElement = this.getCoveredElement();
            var overlay = this.getOverlay();

            if (overlayShouldBeOnTop) {
                this.assertTrue(topMostElement !== coveredElement, 'The topmost element should not be the covered element.');
                this.assertTrue(topMostElement === overlay, 'The topmost element should be the overlay.');
            } else {
                this.assertTrue(topMostElement !== overlay, 'The topmost element should not be the overlay.');
            }
        },

        assertOverlayZIndex: function (expectedValue) {
            var overlay = this.getOverlay();

            var zIndex = this.getStyle(overlay, 'zIndex');

            zIndex = parseInt(zIndex, 10);
            if (isNaN(zIndex) || zIndex === 0) {
                zIndex = null;
            }

            this.assertTrue(zIndex == expectedValue, 'zIndex did not match the expected value: is ' + zIndex + ' instead of ' + expectedValue);
        },



        ////////////////////////////////////////////////////////////////////////
        // Getters
        ////////////////////////////////////////////////////////////////////////

        getOverlay: function () {
            var document = this.getDocument();
            var body = document.body;
            var children = body.children;

            return children[children.length - 1];
        },

        getTopMostElement: function () {
            var document = this.getDocument();
            var referenceElement = this.getReferenceElement();

            var geometry = aria.utils.Dom.getGeometry(referenceElement);
            var left = geometry.x;
            var top = geometry.y;
            var width = geometry.width;
            var height = geometry.height;

            var centerX = left + (width / 2);
            var centerY = top + (height / 2);

            return document.elementFromPoint(centerX, centerY);
        },

        getCoveredElement: function () {
            return this.getElementById(this.data.coveredElementId);
        },

        getReferenceElement: function () {
            return this.getElementById(this.data.childElementId);
        },

        getDocument: function () {
            return this.testDocument;
        },

        getStyle: function (element, property) {
            return this.templateCtxt._tpl.getStyle(element, property);
        }
    }
});
