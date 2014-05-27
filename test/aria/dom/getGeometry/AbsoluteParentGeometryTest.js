/*
 * Copyright 2014 Amadeus s.a.s.
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
 * Regression test for a bug where a combination of node's height being 0 (due to having only floated or absolutely
 * positioned children) and other factors made aria.utils.Dom.getGeometry(element) returning null, wrongly assuming the
 * element is not visible in the viewport
 */
Aria.classDefinition({
    $classpath : 'test.aria.dom.getGeometry.AbsoluteParentGeometryTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.utils.Dom'],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.testarea = Aria.$window.document.getElementById("TESTAREA");
    },
    $destructor : function () {
        this.testarea = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {

        tearDown : function () {
            this.testarea.innerHTML = "";
        },
        "test inline child with Arial" : function () {
            // See https://bugzilla.mozilla.org/show_bug.cgi?id=1014738
            // See http://meyerweb.com/eric/thoughts/2008/05/06/line-height-abnormal/
            // This affects Firefox at all font sizes, and Chrome at big font sizes

            // The issue here is that for Arial font (and Times New Roman), the numeric value of CSS line-height
            // "normal" is such that the inline child of a block has offset top > 0 (depending on the font size) with
            // respect to the parent which is a scenario not taken into account in DomUtil::getGeometry, and res.height
            // becomes negative

            var document = Aria.$window.document;
            var domUtil = aria.utils.Dom;

            var parent = document.createElement('div');
            parent.style.cssText = 'overflow:auto;';
            parent.innerHTML = '<div id="child" style="position:absolute; width:200px; background-color:lime">'
                    + '<span id="grandChild" style="display:inline; font-family:Arial; font-size:50px; background-color:violet;">content</span></div>';

            this.testarea.appendChild(parent);

            // precondition of the test
            this.assertEquals(parent.offsetHeight, 0);

            var grandChild = domUtil.getElementById("grandChild");
            var geo = domUtil.getGeometry(grandChild);
            this.assertNotNull(geo, "Child's geometry should not have been null");

            // there are little browser and system discrepancies here, hence testing just approximately
            this.assertTrue(50 < geo.height && geo.height < 70, "height should have been around 55-60px, got " + geo.height);
            this.assertTrue(0 <= geo.y && geo.y < 10, "y should have been around 0, got " + geo.y);
            this.assertTrue(0 <= geo.x && geo.x < 10, "x should have been around 0, got " + geo.x);
        },

        "test small child far from top of parent with zero height" : function () {

            var document = Aria.$window.document;
            var domUtil = aria.utils.Dom;

            var parent = document.createElement('div');
            parent.style.cssText = 'overflow:auto;';
            parent.innerHTML = '<div id="child" style="position:absolute; left: 7px; top:11px; width:200px; background-color:black">'
                    + '<div id="grandChild" style="display:block; margin-left:50px; margin-top:300px; height:30px; background-color:yellow;">content</div></div>';

            this.testarea.appendChild(parent);

            // precondition of the test
            this.assertEquals(parent.offsetHeight, 0);

            var grandChild = domUtil.getElementById("grandChild");
            var geo = domUtil.getGeometry(grandChild);
            this.assertNotNull(geo, "Child's geometry should not have been null");
            this.assertEquals(geo.x, 50 + 7);
            this.assertEquals(geo.y, 300 + 11);
            this.assertEquals(geo.height, 30);
            this.assertEquals(geo.width, 200 - 50);
        }
    }
});
