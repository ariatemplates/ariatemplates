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
    $classpath : "test.aria.utils.overlay.loadingIndicator.scrollbar.ScrollbarTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.templates.Layout", "aria.utils.DomOverlay"],
    $prototype : {

        _getOverlay : function (element) {
            var domOverlay = aria.utils.DomOverlay;
            var id = domOverlay.UNIQUE_ID_GENERATOR;
            var overlay = domOverlay.overlays[id];
            this.assertTrue(overlay.element == element, "could not get the right overlay element");
            return overlay.overlay;
        },

        _checkOverlay : function (element, width, height) {
            var overlay = this._getOverlay(element);

            var geomElt = aria.utils.Dom.getGeometry(element);
            this.assertTrue(geomElt.width == width, "wrong width from getGeometry");
            this.assertTrue(geomElt.height == height, "wrong height from getGeometry");

            var geomOverlay = aria.utils.Dom.getGeometry(overlay);

            this.assertTrue(geomOverlay.x == geomElt.x, "wrong overlay x position");
            this.assertTrue(geomOverlay.y == geomElt.y, "wrong overlay y position");
            this.assertTrue(geomOverlay.width == width, "wrong overlay width");
            this.assertTrue(geomOverlay.height == height, "wrong overlay height");
        },

        runTemplateTest : function () {
            var myParentDiv = this.templateCtxt.$getElementById("myParentDiv");
            var myChildDiv = this.templateCtxt.$getElementById("myChildDiv");
            var myScrolledDiv = this.templateCtxt.$getElementById("myScrolledDiv");
            var realScrolledDiv = this.getElementById("myScrolledDiv");

            var scrollBarWidth = aria.templates.Layout.getScrollbarsWidth();

            myParentDiv.setScroll({
                scrollLeft : 100,
                scrollTop : 100
            });

            myChildDiv.setScroll({
                scrollLeft : 100,
                scrollTop : 100
            });

            // set the processing indicator on the child div
            myScrolledDiv.setProcessingIndicator(true);
            // On mac, webkit scrollbars are not visualized without scrolling
            if (aria.core.Browser.isMac && aria.core.Browser.isWebkit) {
                this._checkOverlay(realScrolledDiv, 190, 90);
            } else {
                this._checkOverlay(realScrolledDiv, 190 - scrollBarWidth, 90 - scrollBarWidth);
            }
            myScrolledDiv.setProcessingIndicator(false);

            myParentDiv.setScroll({
                scrollLeft : 0,
                scrollTop : 0
            });

            myScrolledDiv.setProcessingIndicator(true);
            if (aria.core.Browser.isMac && aria.core.Browser.isWebkit) {
                this._checkOverlay(realScrolledDiv, 188, 38);
            } else {
                this._checkOverlay(realScrolledDiv, 188 - scrollBarWidth, 38 - scrollBarWidth);
            }
            myScrolledDiv.setProcessingIndicator(false);

            myParentDiv.setScroll({
                scrollLeft : 438,
                scrollTop : 229
            });

            myChildDiv.setScroll({
                scrollLeft : 69,
                scrollTop : 305
            });

            myScrolledDiv.setProcessingIndicator(true);
            if (aria.core.Browser.isMac && aria.core.Browser.isWebkit) {
                this._checkOverlay(realScrolledDiv, 104, 112);
            } else {
                this._checkOverlay(realScrolledDiv, 104 - scrollBarWidth, 112);
            }
            myScrolledDiv.setProcessingIndicator(false);

            myParentDiv.$dispose();
            myChildDiv.$dispose();
            myScrolledDiv.$dispose();
            this.notifyTemplateTestEnd();
        }
    }
});
