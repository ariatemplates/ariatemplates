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
 * Test case for aria.utils.Dom
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Dom",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Type", "aria.utils.DomBeans", "aria.popups.Beans",
            "aria.utils.Math", "aria.core.JsonValidator"],
    $constructor : function () {
        /**
         * Dom elements created, to delete them if there was any issue in the test
         * @type Array
         */
        this.domCreated = [];

        aria.utils.Dom.getDocumentScrollElement();

        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        tearDown : function () {
            for (var index = 0, l = this.domCreated.length; index < l; index++) {
                var dom = this.domCreated[index];
                if (dom) {
                    aria.utils.Dom.removeElement(dom);
                }
            }
            Aria.$window.scroll(0, 0);
        },

        test_getDocumentScrollElement : function () {
            var documentScrollElement = aria.utils.Dom.getDocumentScrollElement();
            this.assertTrue(aria.utils.Type.isHTMLElement(documentScrollElement));
        },

        test_getDocumentScroll : function () {
            var _getDocumentScroll = aria.utils.Dom._getDocumentScroll();
            this.assertTrue(aria.utils.Type.isObject(_getDocumentScroll));
            this.assertTrue(aria.utils.Type.isNumber(_getDocumentScroll.scrollLeft));
            this.assertTrue(aria.utils.Type.isNumber(_getDocumentScroll.scrollTop));
        },

        test_getViewportSize : function () {
            var _getViewportSize = aria.utils.Dom._getViewportSize();
            this.assertTrue(aria.utils.Type.isObject(_getViewportSize));
            this.assertTrue(aria.utils.Type.isNumber(_getViewportSize.width));
            this.assertTrue(aria.utils.Type.isNumber(_getViewportSize.height));
        },

        test_isInViewport : function () {
            Aria.$window.scroll(0, 0); // this test expects the window not to be scrolled
            var position = {
                top : 0,
                left : 0
            };
            var size = {
                width : 0,
                height : 0
            };

            this.assertTrue(aria.utils.Dom.isInViewport(position, size));

            position = {
                top : 0,
                left : 0
            };
            size = {
                width : 10000,
                height : 10000
            };

            this.assertFalse(aria.utils.Dom.isInViewport(position, size));

            position = {
                top : -1,
                left : 0
            };
            size = {
                width : 10,
                height : 10
            };

            this.assertFalse(aria.utils.Dom.isInViewport(position, size));

            position = {
                top : 10,
                left : 10
            };
            size = {
                width : 100,
                height : 100
            };

            this.assertTrue(aria.utils.Dom.isInViewport(position, size));
        },

        test_isAncestor : function () {
            var document = Aria.$window.document;
            var child = document.createElement("div");
            var parent = document.createElement("div");
            var grandparent = document.createElement("div");

            grandparent.appendChild(parent).appendChild(child);

            this.assertTrue(aria.utils.Dom.isAncestor(child, child));
            this.assertTrue(aria.utils.Dom.isAncestor(child, parent));
            this.assertTrue(aria.utils.Dom.isAncestor(child, grandparent));
            this.assertTrue(aria.utils.Dom.isAncestor(parent, grandparent));

            this.assertFalse(aria.utils.Dom.isAncestor(parent, child));
            this.assertFalse(aria.utils.Dom.isAncestor(grandparent, child));
            this.assertFalse(aria.utils.Dom.isAncestor(grandparent, parent));
            this.assertFalse(aria.utils.Dom.isAncestor());
        },

        test_isInDom : function () {
            var document = Aria.$window.document;
            var elt = document.createElement("div");
            var childElt = document.createElement("div");
            elt.style.cssText = "display:none;";

            this.assertFalse(aria.utils.Dom.isInDom(elt));
            this.assertFalse(aria.utils.Dom.isInDom(childElt));

            elt.appendChild(childElt);

            this.assertFalse(aria.utils.Dom.isInDom(elt));
            this.assertFalse(aria.utils.Dom.isInDom(childElt));

            document.body.appendChild(elt);

            this.assertTrue(aria.utils.Dom.isInDom(elt));
            this.assertTrue(aria.utils.Dom.isInDom(childElt));

            document.body.removeChild(elt);

            this.assertFalse(aria.utils.Dom.isInDom(elt));
            this.assertFalse(aria.utils.Dom.isInDom(childElt));
            this.assertFalse(aria.utils.Dom.isInDom());

        },

        test_insertAdjacentHTML : function () {
            var dom = aria.utils.Dom;
            var document = Aria.$window.document;
            var element = document.createElement("div");
            document.body.appendChild(element);
            // especially test with tables, as this is the case with which there can be problems in IE:
            element.innerHTML = '<table><tbody><tr><td>a,0,0</td><td>a,0,1</td></tr><tr><td>a,1,0</td><td>a,1,1</td></tr></tbody></table>';
            var tbody = element.getElementsByTagName('tbody')[0];
            dom.insertAdjacentHTML(tbody, "beforeEnd", '<tr><td>b,0,0</td><td>b,0,1</td></tr><tr><td>b,1,0</td><td>b,1,1</td></tr>');
            dom.insertAdjacentHTML(tbody, "afterBegin", '<tr><td>c,0,0</td><td>c,0,1</td></tr><tr><td>c,1,0</td><td>c,1,1</td></tr>');
            dom.insertAdjacentHTML(tbody, "afterEnd", '<tbody><tr><td>d,0,0</td><td>d,0,1</td></tr></tbody><tbody><tr><td>d,1,0</td><td>d,1,1</td></tr></tbody>');
            dom.insertAdjacentHTML(tbody, "beforeBegin", '<tbody><tr><td>e,0,0</td><td>e,0,1</td></tr></tbody><tbody><tr><td>e,1,0</td><td>e,1,1</td></tr></tbody>');
            var tr = element.getElementsByTagName('tr')[0];
            dom.insertAdjacentHTML(tr, "beforeEnd", '<td>f,0,0</td><td>f,0,1</td>');
            dom.insertAdjacentHTML(tr, "afterBegin", '<td>g,0,0</td><td>g,0,1</td>');
            dom.insertAdjacentHTML(tr, "afterEnd", '<tr><td>h,0,0</td><td>h,0,1</td></tr><tr><td>h,1,0</td><td>h,1,1</td></tr>');
            dom.insertAdjacentHTML(tr, "beforeBegin", '<tr><td>i,0,0</td><td>i,0,1</td></tr><tr><td>i,1,0</td><td>i,1,1</td></tr>');
            var expectedHTML = "<table><tbody><tr><td>i,0,0</td><td>i,0,1</td></tr><tr><td>i,1,0</td><td>i,1,1</td></tr><tr><td>g,0,0</td><td>g,0,1</td><td>e,0,0</td><td>e,0,1</td><td>f,0,0</td><td>f,0,1</td></tr><tr><td>h,0,0</td><td>h,0,1</td></tr><tr><td>h,1,0</td><td>h,1,1</td></tr></tbody><tbody><tr><td>e,1,0</td><td>e,1,1</td></tr></tbody><tbody><tr><td>c,0,0</td><td>c,0,1</td></tr><tr><td>c,1,0</td><td>c,1,1</td></tr><tr><td>a,0,0</td><td>a,0,1</td></tr><tr><td>a,1,0</td><td>a,1,1</td></tr><tr><td>b,0,0</td><td>b,0,1</td></tr><tr><td>b,1,0</td><td>b,1,1</td></tr></tbody><tbody><tr><td>d,0,0</td><td>d,0,1</td></tr></tbody><tbody><tr><td>d,1,0</td><td>d,1,1</td></tr></tbody></table>";
            var actualHTML = element.innerHTML;
            actualHTML = actualHTML.toLowerCase().replace(/\s*/g, ''); // put everything in lower case and remove
            // spaces
            this.assertTrue(expectedHTML == actualHTML);
            dom.removeElement(element);
        },

        test_calculatePosition : function () {
            Aria.$window.scroll(0, 0); // this test expects the window not to be scrolled
            var document = Aria.$window.document;
            var element = document.createElement("div");

            element.style.cssText = ['display:block;', 'visibility:hidden;'].join('');

            var position = aria.utils.Dom.calculatePosition(element);
            var isValidReturn = aria.core.JsonValidator.check(position, "aria.utils.DomBeans.Position");

            this.assertTrue(isValidReturn);

            element.style.cssText = ['display:block;', 'visibility:hidden;', 'position:absolute;', 'top:25px;',
                    'left:25px;'].join('');

            position = aria.utils.Dom.calculatePosition(element);

            isValidReturn = aria.core.JsonValidator.check(position, "aria.utils.DomBeans.Position");
            this.assertTrue(isValidReturn);

            this.assertTrue((position.left === 0) && (position.top === 0));

            document.body.appendChild(element);
            this.domCreated.push(element);

            position = aria.utils.Dom.calculatePosition(element);

            isValidReturn = aria.core.JsonValidator.check(position, "aria.utils.DomBeans.Position");
            this.assertTrue(isValidReturn);

            this.assertTrue((position.left == 25) && (position.top == 25));

            // tests for the new stopAbsolute parameter

            // create a child of element
            var child = document.createElement("div");
            child.style.cssText = ['display:block;', 'visibility:hidden;', 'position:absolute;', 'top:10px;',
                    'left:10px;'].join('');
            element.appendChild(child);

            // now append a grandchild and calculate its position with different values for stopAbsolute
            var grandchild = document.createElement("div");
            grandchild.style.cssText = ['display:block;', 'visibility:hidden;', 'position:relative;', 'top:10px;',
                    'left:10px;'].join('');
            child.appendChild(grandchild);
            var grandchildposition_stopAbsolute = aria.utils.Dom.calculatePosition(grandchild, true);
            var grandchildposition_dontStop = aria.utils.Dom.calculatePosition(grandchild, false);
            this.assertTrue((grandchildposition_stopAbsolute.left == 10) && (grandchildposition_stopAbsolute.top == 10));
            this.assertTrue((grandchildposition_dontStop.left == 45) && (grandchildposition_dontStop.top == 45));

            this.domCreated.pop();
            aria.utils.Dom.removeElement(element);
        },

        /**
         * Test the scroll Into View method
         */
        test_scrollIntoView : function () {
            Aria.$window.scroll(0, 0);
            var document = Aria.$window.document;
            var test = document.createElement("div");
            this.domCreated.push(test);
            var height = document.createElement("div");
            this.domCreated.push(height);

            document.body.appendChild(test);
            document.body.appendChild(height);
            test.style.cssText = 'display:block;position:absolute;top:150px;left:50px;';
            // Put some content in the body to make sure that on every test environment the body has height > 0
            height.style.cssText = 'display:block;position:relative;width:200px;height:200px;';
            var innerHTML = ["<div id='cont' style='width:300px;height:300px;background:#EFE4BD;border:"
                    + "20px solid #333;overflow:auto;margin:10px;padding:10px;'><div style='width:1000px;'>"];
            for (var i = 0; i < 100; i++) {
                var background = "#BAB293";
                if (i == 66 || i == 50 || i == 77) {
                    background = "#A32500";
                }
                innerHTML.push("<span id='block_");
                innerHTML.push(i);
                innerHTML.push("' style='display:inline-block;height:60px;width:60px;margin:10px;border:solid 10px #A39770;background:");
                innerHTML.push(background);
                if (i == 50) {
                    innerHTML.push(";float:right");
                }
                innerHTML.push("'></span>");
            }
            innerHTML.push("</div></div>");
            test.innerHTML = innerHTML.join('');

            var container = test.firstChild;
            test.scrollTop = 20;
            test.scrollLeft = 20;
            var target = document.getElementById("block_50");


            aria.utils.Dom.scrollIntoView(target, false);

            // measuring pos is more reliable
            var position = aria.utils.Dom.calculatePosition(target);

            this.assertTrue(position.top <= 405 && position.top >= 401, "Did not scroll vertically properly to object");
            this.assertTrue(position.left <= 304 && position.left >= 300, "Did not scroll vertically properly to object");

            target = document.getElementById("block_66");

            aria.utils.Dom.scrollIntoView(target, true);

            var position = aria.utils.Dom.calculatePosition(target);
            this.assertTrue(position.top < 182 && position.top > 178, "Did not scroll vertically properly to object");
            this.assertTrue(position.left < 82 && position.left > 78, "Did not scroll vertically properly to object");

            target = document.getElementById("block_77");

            // this should not change scrolls as target is already visible
            aria.utils.Dom.scrollIntoView(target);
            this.assertTrue(position.top < 182 && position.top > 178, "Did not scroll vertically properly to object");
            this.assertTrue(position.left < 82 && position.left > 78, "Did not scroll vertically properly to object");

            // test body scrolling
            test.innerHTML = "<div id='block_block' style='display:inline-block;height:60px;width:60px;margin:10px;border:solid 10px #A39770;background:#A32500;'></div>";
            test.style.cssText = 'position:absolute;width:5000px;height:5000px;background:#728FCE;top:0;left:0;';
            Aria.$window.scroll(300, 300);

            target = document.getElementById("block_block");
            aria.utils.Dom.scrollIntoView(target, true);

            this.assertTrue(document.body.scrollTop < 20, "Body did not scroll vertically properly to object");
            this.assertTrue(document.documentElement.scrollTop < 20, "Document element did not scroll vertically properly to object");

            this.domCreated.pop();
            aria.utils.Dom.removeElement(test);

        },

        test_isInside : function () {
            var domUtil = aria.utils.Dom;
            var needle = {
                x : 10,
                y : 20,
                width : 200,
                height : 200
            };
            var haystack = {
                x : 0,
                y : 0,
                width : 300,
                height : 300
            };
            this.assertTrue(domUtil.isInside(needle, haystack));
            this.assertFalse(domUtil.isInside(haystack, needle));

            haystack.x = 21;
            this.assertFalse(domUtil.isInside(needle, haystack));

            haystack.x = 0;
            haystack.y = 50;
            this.assertFalse(domUtil.isInside(needle, haystack));

            haystack.y = 0;
            haystack.width = 50;
            this.assertFalse(domUtil.isInside(needle, haystack));

            haystack.width = 300;
            haystack.height = 50;
            this.assertFalse(domUtil.isInside(needle, haystack));

            delete haystack.width;
            delete haystack.height;
            this.assertFalse(domUtil.isInside(needle, haystack));

            haystack.width = 199;
            haystack.height = 199;
            this.assertFalse(domUtil.isInside(needle, haystack));

            this.assertTrue(domUtil.isInside(needle, domUtil.VIEWPORT));
            needle.x = 15000;
            this.assertFalse(domUtil.isInside(needle, domUtil.VIEWPORT));

            delete needle.width;
            delete needle.height;
            needle.x = 50;
            this.assertTrue(domUtil.isInside(needle, domUtil.VIEWPORT));
            this.assertTrue(domUtil.isInside(needle, haystack));
        },

        test_fitInside : function () {
            var domUtil = aria.utils.Dom;
            var needle = {
                x : 10,
                y : 20,
                width : 200,
                height : 200
            };
            var haystack = {
                x : 0,
                y : 0,
                width : 300,
                height : 300
            };
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 10,
                top : 20
            });

            haystack.x = 25;
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 25,
                top : 20
            });
            haystack.y = 25;
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 25,
                top : 25
            });

            needle.x = 150;
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 125,
                top : 25
            });
            haystack.x = 0;
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 100,
                top : 25
            });
            needle.height = 280;
            needle.y += 30;
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 100,
                top : 45
            });

            haystack.x = 200;
            haystack.y = 250;
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 200,
                top : 250
            });
            needle.width = 310;
            needle.height = 320;
            needle.x = 200;
            needle.y = 250;
            this.assertJsonEquals(domUtil.fitInside(needle, haystack), {
                left : 190,
                top : 230
            });
        },

        /**
         * We need to take into account the fact that a viewport might have different sizes.<br />
         * Checks that a box, smaller than the vieport, is inside it without changing position
         */
        testFitInViewport : function () {
            var domUtil = aria.utils.Dom;
            var viewport = domUtil.getViewportSize();

            var x = viewport.width / 4;
            var y = viewport.height / 4;

            var needle = {
                x : x,
                y : y,
                width : 2 * x,
                height : 2 * y
            };

            this.assertJsonEquals(domUtil.fitInside(needle, domUtil.VIEWPORT), {
                left : x,
                top : y
            });
        }

    }
});
