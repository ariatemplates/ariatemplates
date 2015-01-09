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
    $classpath : "test.aria.utils.overlay.loadingIndicator.scrollableBody.ScrollableBodyTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.utils.overlay.loadingIndicator.scrollableBody.TestTemplate",
            iframe : true
        });
    },
    $prototype : {

        runTemplateTest : function () {
            this.body = this.testDocument.body;
            this.body.style.overflow = "auto";
            this.spanWithLoader = this.testWindow.aria.utils.Dom.getElementById("needLoader");
            this.domOverlay = this.testWindow.aria.utils.DomOverlay;
            this.testWindow.Aria.load({
                classes : ["aria.utils.DomOverlay"],
                oncomplete : {
                    fn : this._addLoadingIndicatorOnSpan,
                    scope : this
                }
            });
        },

        _addLoadingIndicatorOnSpan : function () {
            this.domOverlay.create(this.spanWithLoader, "just a message");
            this.domOverlay.create(this.body, "just a message");

            this._testOverlay(this.spanWithLoader, "none");
            this._testBodyOverlay();

            this._setScroll(2000, 0);
            aria.core.Timer.addCallback({
                fn : this._afterFirstScroll,
                scope : this,
                delay : 300
            });

        },

        _afterFirstScroll : function () {
            this._testOverlay(this.spanWithLoader, "block", 300, 200);
            this._testBodyOverlay();

            this._setScroll(2100, 0);
            aria.core.Timer.addCallback({
                fn : this._afterSecondScroll,
                scope : this,
                delay : 300
            });
        },

        _afterSecondScroll : function () {
            this._testOverlay(this.spanWithLoader, "block", 300, 100, 0, 20);
            this._testBodyOverlay();

            this.testIframe.style.width = "100px";
            aria.core.Timer.addCallback({
                fn : this._afterResize,
                scope : this,
                delay : 300
            });

        },

        _afterResize : function () {
            this._testOverlay(this.spanWithLoader, "none");
            this._testBodyOverlay();

            this.testIframe.style.width = "1000px";
            this._setScroll(2500, 0);
            aria.core.Timer.addCallback({
                fn : this._afterThirdScroll,
                scope : this,
                delay : 300
            });

        },

        _afterThirdScroll : function () {
            this._testOverlay(this.spanWithLoader, "none");
            this._testBodyOverlay();

            this._setScroll(2000, 1000);
            aria.core.Timer.addCallback({
                fn : this._afterForthScroll,
                scope : this,
                delay : 300
            });

        },

        _afterForthScroll : function () {
            this._testOverlay(this.spanWithLoader, "none");
            this._testBodyOverlay();

            this._setScroll(2000, 200);
            aria.core.Timer.addCallback({
                fn : this._afterFifthScroll,
                scope : this,
                delay : 300
            });

        },

        _afterFifthScroll : function () {
            this._testOverlay(this.spanWithLoader, "block", 250, 200, 10);
            this._testBodyOverlay();

            this.domOverlay.detachFrom(this.spanWithLoader);
            this.domOverlay.detachFrom(this.body);

            this.end();
        },

        _setScroll : function (scrollTop, scrollLeft) {
            this.testWindow.scrollTo(scrollLeft, scrollTop);
        },

        _testOverlay : function (element, display, width, height, tolWidth, tolHeight) {
            tolWidth = tolWidth || 0;
            tolHeight = tolHeight || 0;
            var overlay = this.domOverlay.__getOverlay(element).overlay.overlay;
            if (display) {
                var msg = "The overlay on " + element.tagName + " had display: %1 instead of %2";
                this.assertEquals(overlay.style.display, display, msg);
            }
            if (width) {
                var actualWidth = parseInt(overlay.style.width, 10);
                this.assertEqualsWithTolerance(actualWidth, width, tolWidth, "Wrong width, expected %2, got %1");
            }
            if (height) {
                var actualHeight = parseInt(overlay.style.height, 10);
                this.assertEqualsWithTolerance(actualHeight, height, tolHeight, "Wrong height, expected %2, got %1");
            }
        },

        _testBodyOverlay : function () {
            var viewportSize = this.testWindow.aria.utils.Dom.getViewportSize();
            this._testOverlay(this.body, "block", viewportSize.width, viewportSize.height);
        }
    }
});
