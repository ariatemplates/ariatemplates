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
 * DomUtil::getGeometry returns the geometry of the **visible** portion of the element on screen. It means that if part
 * of the element is not visible due to scroll, overflows etc., the element's dimensions should be truncated
 * accordingly. This tests different situations triggering that behavior.
 */
Aria.classDefinition({
    $classpath : 'test.aria.dom.getGeometry.PartiallyOverflowingFromParentTest',
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
        setUp : function () {
            this.container = Aria.$window.document.createElement('div');
            this.container.setAttribute('id', 'container');
            this.testarea.appendChild(this.container);
        },

        tearDown : function () {
            this.container = null;
            this.testarea.innerHTML = "";
        },

        "test normal child" : function () {
            // ..............
            // .....II.......
            // ..............

            this._testChildGeometryHeight({
                parent : {
                    height : 333
                },
                child : {
                    height : 111
                },
                expectChildGeo : true,
                expectedChildGeoHeight : 111
            });
        },

        "test overflowing child" : function () {
            // .....II.......
            // .....II.......
            // .....II.......
            // _____OO_______

            this._testChildGeometryHeight({
                parent : {
                    height : 333
                },
                child : {
                    height : 500
                },
                expectChildGeo : true,
                expectedChildGeoHeight : 333
            });
        },
        "test overflowing child with top margin" : function () {
            // ..............
            // ..............
            // .....II.......
            // _____OO_______
            // _____OO_______
            // _____OO_______

            this._testChildGeometryHeight({
                parent : {
                    height : 333
                },
                child : {
                    height : 500,
                    marginTop : 133
                },
                expectChildGeo : true,
                expectedChildGeoHeight : 333 - 133
            });
        },
        "test invisible child due to margins" : function () {
            // ..............
            // ______________
            // ______________
            // ______________
            // _____OO_______

            this._testChildGeometryHeight({
                parent : {
                    height : 100
                },
                child : {
                    height : 50,
                    marginTop : 400
                },
                expectChildGeo : false
            });
        },
        "test child visible, despite margins, due to top scroll" : function () {
            // XXXXXXXXXXXXXX
            // XXXXXXXXXXXXXX
            // XXXXXXXXXXXXXX
            // ..............
            // ......II......

            this._testChildGeometryHeight({
                parent : {
                    height : 100,
                    scrollTop : 350
                },
                child : {
                    height : 50,
                    marginTop : 400
                },
                expectChildGeo : true,
                expectedChildGeoHeight : 50
            });
        },

        "test child invisible due to top scroll of grandparent" : function () {
            // XPPPPPccPPPPPP
            // XPPPPPPPPPPPPP
            // XMMMMMMMMMMMMM
            // XMMMMMMMMMMMMM
            // XMMMMMMMMMMMMM
            // XMMMMMMMMMMMMM
            // ..............
            this.container.style.cssText = "overflow:scroll;width:500px;height:500px;background-color:red;";

            var newDiv = Aria.$window.document.createElement('div');
            newDiv.setAttribute('id', 'wantToBeInViewport');
            newDiv.style.cssText = "position:relative; top:600px; width:100px; height:100px; background-color:brown";
            this.container.appendChild(newDiv);

            // for unexplicable reasons IE8 wouldn't set container.scrollTop if passed, hence using scrollIntoView...
            this._testChildGeometryHeight({
                scrollIntoView : "wantToBeInViewport",
                parent : {
                    height : 100,
                    marginBottom : 800
                },
                child : {
                    height : 50
                },
                expectChildGeo : false
            });
        },

        "test child invisible despite top scroll" : function () {
            // XXXXXXXXXXXXXX
            // XXXXXXXXXXXXXX
            // XXXXXXXXXXXXXX
            // ..............
            // ..............
            // ______________
            // ______OO______

            this._testChildGeometryHeight({
                parent : {
                    height : 200,
                    scrollTop : 300
                },
                child : {
                    height : 50,
                    marginTop : 600
                },
                expectChildGeo : false
            });
        },

        "test overflowing child in parent with scrollbars should substract scrollbar height" : function () {
            // .....II.......
            // .....II.......
            // .....II.......
            // SSSSSOOSSSSSSS
            // _____OO_______

            // using range to not care much about exact height of the scrollbar which may vary across the browsers
            this._testChildGeometryHeight({
                parent : {
                    height : 333,
                    overflow : "scroll"
                },
                child : {
                    height : 500
                },
                expectChildGeo : true,
                expectedChildGeoHeightRange : [313, 332]
            });
        },

        _testChildGeometryHeight : function (opt) {
            var domUtil = aria.utils.Dom;

            var parentStyle = 'background-color:lime; overflow:' + (opt.parent.overflow || "auto") + '; height:'
                    + opt.parent.height + 'px; width:500px; margin-bottom:' + (opt.parent.marginBottom || 0) + 'px';
            var childStyle = 'background-color:violet; height:' + opt.child.height + 'px; margin-top:'
                    + (opt.child.marginTop || 0) + 'px; ';
            this.container.innerHTML = '<div id="parent" style="' + parentStyle + '"><div id="child" style="'
                    + childStyle + '">content</div></div>' + this.container.innerHTML;

            // paranoic scroll checks are for IE8/7
            if (opt.parent.scrollTop) {
                var div = domUtil.getElementById("parent");
                div.scrollTop = opt.parent.scrollTop;
                this.assertEquals(div.scrollTop, opt.parent.scrollTop, "Container wasn't scrolled, which was a prerequisuite for the test");
            }
            if (opt.scrollIntoView) {
                domUtil.getElementById(opt.scrollIntoView).scrollIntoView();
                this.assertTrue(domUtil.getElementById("container").scrollTop > 0, "Container wasn't scrolled, which was a prerequisuite for the test");
            }

            var child = domUtil.getElementById("child");
            var geo = domUtil.getGeometry(child);

            if (opt.expectChildGeo) {
                this.assertNotNull(geo, "Expected not null geometry");
            } else {
                this.assertNull(geo, "getGeometry should have returned null");
            }

            if (opt.expectedChildGeoHeight) {
                this.assertEquals(geo.height, opt.expectedChildGeoHeight, "Child's getGeometry().height should have been %2, got %1");
            }
            if (opt.expectedChildGeoHeightRange) {
                var range = opt.expectedChildGeoHeightRange;
                this.assertTrue(range[0] < geo.height && geo.height < range[1]);
            }
        }
    }
});
