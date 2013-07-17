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
 * Test different API for DOM utility
 * @class test.aria.dom.basic.DomTestCase
 */
Aria.classDefinition({
    $classpath : 'test.aria.dom.basic.DomTestCase',
    $extends : 'aria.jsunit.TemplateTestCase',
    $dependencies : ['aria.utils.Dom', 'aria.templates.Layout'],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.dom.basic.BigPage"
        });
    },
    $prototype : {

        runTemplateTest : function () {

            // get the page size
            var size = aria.utils.Dom.getFullPageSize();
            var viewport = aria.utils.Dom._getViewportSize();

            // Should be bigger than the viewport
            this.assertTrue(size.width >= viewport.width, "Page width should be bigger than viewport width.");
            this.assertTrue(size.height >= viewport.height, "Page height should be bigger than viewport height.");

            // Test another page
            this._replaceTestTemplate({
                template : "test.aria.dom.basic.LongPage"
            }, {
                fn : this.myTestLongPage,
                scope : this
            });
        },

        myTestLongPage : function () {
            // get the page size
            var size = aria.utils.Dom.getFullPageSize();
            var viewport = aria.utils.Dom._getViewportSize();

            // Should be bigger only longer the viewport
            // Commented out as this breaks the automated test suite run daily on aria server:
            // this.assertTrue(size.width === viewport.width, "Your browser should be maximized for this test to pass");
            this.assertTrue(size.height >= viewport.height, "Page height should be bigger than viewport height for long pages.");

            // Test another page
            this._replaceTestTemplate({
                template : "test.aria.dom.basic.SmallPage"
            }, {
                fn : this.myTestSmallPage,
                scope : this
            });
        },

        myTestSmallPage : function (args) {
            // get the page size
            var size = aria.utils.Dom.getFullPageSize();
            var viewport = aria.utils.Dom._getViewportSize();

            // Should be bigger equal to the viewport
            this.assertTrue(size.width === viewport.width, "Page width should be viewport width.");
            // This assertion cannot be proved, the tester adds something in the page that makes it long
            // this.assertTrue(size.height === viewport.height);

            // Test the geometry utility
            this._replaceTestTemplate({
                template : "test.aria.dom.basic.Geometry"
            }, {
                fn : this.myTestGeometry,
                scope : this
            });
        },

        myTestGeometry : function () {
            // Geometry of the first div
            var uDom = aria.utils.Dom, div, geo, span;
            var scrollbarsWidth = aria.templates.Layout.getScrollbarsWidth();

            div = this.getElementById("d1");
            geo = uDom.getGeometry(div);

            this.assertTrue(geo.x < 30, "d1: Expected x < 30, got " + geo.x);
            this.assertTrue(geo.y < 30, "d1: Expected y < 30, got " + geo.y);
            this.assertTrue(geo.width === 100, "d1: Expected width equal to 100, got " + geo.width);
            this.assertTrue(geo.height === 100, "d1: Expected height equal to 100, got " + geo.height);

            // Geometry of the second div
            div = this.getElementById("d2");
            geo = uDom.getGeometry(div);

            this.assertTrue(geo.x < 30, "d2: Expected x < 30, got " + geo.x);
            this.assertTrue(geo.y >= 100, "d2: Expected y >= 100, got " + geo.y);
            this.assertTrue(geo.width === 100, "d2: Expected width equal to 100, got " + geo.width);
            this.assertTrue(geo.height === 100, "d2: Expected height equal to 100, got " + geo.height);

            // Geometry of the span
            span = this.getElementById("s1");
            geo = uDom.getGeometry(span);

            // getGeometry returns the visible part of s1, which is limited by its parent element
            this.assertTrue(geo.x < 30, "s1: Expected x < 30, got " + geo.x);
            this.assertTrue(geo.y >= 100, "s1: Expected y >= 100, got " + geo.y);
            this.assertTrue(geo.width == (100 - scrollbarsWidth), "s1: Expected width == 100 - scollbarsWidth, got "
                    + geo.width);
            this.assertTrue(geo.height == (100 - scrollbarsWidth), "s1: Expected height == 100 - scollbarsWidth, got "
                    + geo.height);

            // End of test
            this.notifyTemplateTestEnd();
        }
    }
});
