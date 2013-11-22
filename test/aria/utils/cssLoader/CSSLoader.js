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
 * Test case for aria.utils.CSSLoader
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.cssLoader.CSSLoader",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.CSSLoader", "aria.utils.Dom"],
    $constructor : function () {
        this.$TestCase.constructor.apply(this, arguments);
        this._loader = aria.utils.CSSLoader;
        this._testDom = this._createTestDom();
    },
    $destructor : function () {
        this._loader = null;
        aria.utils.Dom.getElementById("TESTAREA").removeChild(this._testDom);
        this._testDom = null;
        this.$TestCase.$destructor.apply(this, arguments);
    },
    $prototype : {

        _createTestDom : function () {
            var tag = Aria.$window.document.createElement("div");
            tag.innerHTML = '<div id="test-div" class="class-one"><span>just some text to fill this span</span></div>';
            aria.utils.Dom.getElementById("TESTAREA").appendChild(tag);
            return tag;
        },

        testAsyncAdd : function () {
            this._add("test/aria/utils/cssLoader/cssOne.css", {
                fn : this._afterFirstAdd,
                scope : this
            }, null, null, {
                value : "355px"
            });
        },

        _afterFirstAdd : function () {

            this._testWidth("355px");
            this._testLinkTag(0);
            this._testLinkTag(1, false);
            this._testReturnedTags([0]);

            this._add(["test/aria/utils/cssLoader/cssOne.css"], {
                fn : this._afterSecondAdd,
                scope : this
            });
        },

        _afterSecondAdd : function () {

            this._testWidth("355px");
            this._testLinkTag(0);
            this._testLinkTag(1, false);
            this._testReturnedTags([0]);
            this._testRemove();

        },

        _testRemove : function () {
            this._loader.remove(["test/aria/utils/cssLoader/cssOne.css"]);
            this._testWidth("355px");
            this._testLinkTag(0);
            this._testLinkTag(1, false);
            this._remove("test/aria/utils/cssLoader/cssOne.css", {
                fn : this._afterFirstRemove,
                scope : this
            });
        },

        _afterFirstRemove : function () {
            var domUtil = aria.utils.Dom;
            this._testWidth("355px", false);
            this._testLinkTag(0, false);

            this._add(["test/aria/utils/cssLoader/cssOne.css", "test/aria/utils/cssLoader/cssTwo.css"], {
                fn : this._afterThirdAdd,
                scope : this
            }, null, null, {
                value : "455px"
            });
        },

        _afterThirdAdd : function () {

            this._testWidth("455px");
            this._testLinkTag(0, false);
            this._testLinkTag(1);
            this._testLinkTag(2);
            this._testLinkTag(3, false);

            this._addedTags = this._loader.add(["test/aria/utils/cssLoader/cssOne.css",
                    "test/aria/utils/cssLoader/cssTwo.css"]);
            this._testReturnedTags([1, 2]);
            this._remove(null, {
                fn : this._afterRemoveAll,
                scope : this
            });
        },

        _afterRemoveAll : function () {

            this._testWidth("355px", false);
            this._testLinkTag(0, false);
            this._testLinkTag(1, false);
            this._testLinkTag(2, false);
            this._testLinkTag(3, false);

            this._testAddWithMedia();

        },

        _testAddWithMedia : function () {
            this._add(["test/aria/utils/cssLoader/cssOne.css", "test/aria/utils/cssLoader/cssTwo.css"], {
                fn : this._afterFirstMediaAdd,
                scope : this
            }, "print");

        },

        _afterFirstMediaAdd : function () {

            this._testWidth("355px", false);
            this._testWidth("455px", false);
            this._testLinkTag(0, false);
            this._testLinkTag(1, false);
            this._testLinkTag(2, false);
            this._testLinkTag(3);
            this._testLinkTag(4);
            this._testLinkTag(5, false);
            this._testReturnedTags([3, 4]);
            this._add(["test/aria/utils/cssLoader/cssTwo.css", "test/aria/utils/cssLoader/cssOne.css"], {
                fn : this._afterSecondMediaAdd,
                scope : this
            }, null, null, {
                value : "355px"
            });

        },

        _afterSecondMediaAdd : function () {

            this._testWidth("355px");
            this._testLinkTag(3);
            this._testLinkTag(4);
            this._testLinkTag(5);
            this._testLinkTag(6);
            this._testLinkTag(7, false);
            this._testReturnedTags([5, 6]);
            this._add(["test/aria/utils/cssLoader/cssOne.css"], {
                fn : this._afterThirdMediaAdd,
                scope : this
            }, "print");
        },

        _afterThirdMediaAdd : function () {
            this._testWidth("355px");
            this._testLinkTag(7, false);
            this._testReturnedTags([3]);
            this._testMediaRemove();
        },

        _testMediaRemove : function () {
            this._loader.remove(["test/aria/utils/cssLoader/cssOne.css", "test/aria/utils/cssLoader/cssTwo.css"], "print");

            this._testWidth("355px");
            this._testLinkTag(3);
            this._testLinkTag(4, false);
            this._testLinkTag(5);
            this._testLinkTag(6);
            this._testLinkTag(7, false);
            this._loader.remove(["test/aria/utils/cssLoader/cssOne.css", "test/aria/utils/cssLoader/cssTwo.css"], "print");
            this._testLinkTag(3, false);
            this._testLinkTag(4, false);
            this._testLinkTag(5);
            this._testLinkTag(6);
            this._testLinkTag(7, false);

            this._loader.removeAll();
            this._testLinkTag(3, false);
            this._testLinkTag(4, false);
            this._testLinkTag(5, false);
            this._testLinkTag(6, false);
            this._testLinkTag(7, false);

            this._testNonExistentCss();

        },

        _testNonExistentCss : function () {
            this._add(["test/aria/utils/cssLoader/fake.css"], {
                fn : this._afterFakeCssAdd,
                scope : this
            });

        },

        _afterFakeCssAdd : function () {
            this._testLinkTag(7);
            this._testLinkTag(8, false);
            this._testReturnedTags([7]);
            this._loader.removeAll();
            this.notifyTestEnd("testAsyncAdd");
        },

        _add : function (sources, cb, media, delay, condition) {
            var that = this;
            if (media) {
                this._addedTags = this._loader.add(sources, media);
            } else {
                this._addedTags = this._loader.add(sources);
            }
            if (condition) {
                this.waitFor({
                    condition : function () {
                        return that._checkWidth.call(that, condition);
                    },
                    callback : cb
                });

            } else {
                delay = (delay != null) ? delay : 100;
                cb.delay = delay;
                aria.core.Timer.addCallback(cb);
            }
        },

        _remove : function (sources, cb, media, delay) {
            delay = (delay != null) ? delay : 100;
            if (sources) {
                if (media) {
                    this._loader.remove(sources, media);
                } else {
                    this._loader.remove(sources);
                }
            } else {
                this._loader.removeAll();
            }
            cb.delay = delay;
            aria.core.Timer.addCallback(cb);
        },

        _testWidth : function (value, equal) {
            equal = (equal === false) ? equal : true;
            var domUtil = aria.utils.Dom;
            var testDiv = domUtil.getElementById("test-div");
            var width = domUtil.getStyle(testDiv, "width");

            if (equal) {
                this.assertEquals(width, value);
            } else {
                this.assertNotEquals(width, value);
            }
        },

        _checkWidth : function (args) {
            var equal = (args.equal === false) ? args.equal : true;
            var value = args.value;
            var domUtil = aria.utils.Dom;
            var testDiv = domUtil.getElementById("test-div");
            var width = domUtil.getStyle(testDiv, "width");
            var returnValue = (width == value);

            if (!equal) {
                returnValue = !returnValue;
            }
            return returnValue;
        },

        _testLinkTag : function (counter, value) {
            value = (value === false) ? false : true;
            var id = this._loader.TAG_PREFIX + counter;
            this.assertEquals(!!aria.utils.Dom.getElementById(id), value);
        },

        _testReturnedTags : function (tagIds) {
            var id, length = tagIds.length;
            this.assertEquals(this._addedTags.length, length, "The number of returned tags is not correct");
            for (var i = 0; i < length; i++) {
                id = this._loader.TAG_PREFIX + tagIds[i];
                this.assertEquals(this._addedTags[i].id, id);
            }
        }

    }
});
