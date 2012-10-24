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
 * Test case for aria.utils.Type
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.TypeTest",
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        /**
         * Test case for the isInstanceOf method
         */
        testIsInstanceOf : function () {
            var typeUtils = aria.utils.Type;
            var seq = new aria.core.Sequencer();
            this.assertTrue(typeUtils.isInstanceOf(seq, "aria.core.Sequencer"));
            this.assertTrue(typeUtils.isInstanceOf(seq, "aria.core.JsObject"));
            this.assertFalse(typeUtils.isInstanceOf(seq, "aria.core.JsClassLoader"));
            seq.$dispose();
            this.assertFalse(typeUtils.isInstanceOf(aria.core.Browser, "aria.core.FileLoader"));
            this.assertTrue(typeUtils.isInstanceOf(aria.core.Browser, "aria.core.JsObject"));
            this.assertFalse(typeUtils.isInstanceOf(null, "aria.core.JsObject"));
            this.assertFalse(typeUtils.isInstanceOf(0, "aria.core.JsObject"));
            this.assertFalse(typeUtils.isInstanceOf("hello", "aria.core.JsObject"));
            this.assertFalse(typeUtils.isInstanceOf(/ /, "aria.core.JsObject"));
        },

        testIsArray : function () {
            var typeUtils = aria.utils.Type;
            this.assertTrue(typeUtils.isArray([]));
            this.assertTrue(typeUtils.isArray([3, 4, 5, 6, "a", false]));
            this.assertTrue(typeUtils.isArray(new Array(10)));
        },

        testIsObject : function () {
            var typeUtils = aria.utils.Type;
            this.assertTrue(typeUtils.isObject({}));
            this.assertTrue(typeUtils.isObject({
                a : 1,
                b : 2,
                c : 3,
                d : {
                    a : 1,
                    b : 2
                }
            }));
            this.assertTrue(typeUtils.isObject(new Object()));

            var obj = new aria.core.JsObject();
            this.assertTrue(typeUtils.isObject(obj));
            obj.$dispose();

            this.assertFalse(typeUtils.isObject(null));
            this.assertFalse(typeUtils.isObject(undefined));
            this.assertFalse(typeUtils.isObject());
        },

        /**
         * Test case for the isContainer method
         */
        testIsContainer : function () {
            var typeUtils = aria.utils.Type;
            this.assertTrue(typeUtils.isContainer([]));
            this.assertTrue(typeUtils.isContainer({}));
            this.assertTrue(typeUtils.isContainer([1, 2, 3, 4]));
            this.assertTrue(typeUtils.isContainer({
                a : 1,
                b : 2,
                c : 3
            }));
            this.assertTrue(typeUtils.isContainer(new Array()));
            this.assertTrue(typeUtils.isContainer(new Object()));

            // Instances of an AT class should not be considered as containers, even though they are objects in the end
            this.assertFalse(typeUtils.isContainer(typeUtils));
            this.assertFalse(typeUtils.isContainer(aria.core.JsObject));
            var obj = new aria.core.JsObject();
            this.assertFalse(typeUtils.isContainer(obj));
            obj.$dispose();
        },

        testIsHTMLElement : function () {
            var typeUtils = aria.utils.Type;

            // Something that is not an HTML element
            var fnc = function () {};
            var ary = ["foo", "bar"];
            var obj = {
                "foo" : "bar"
            };
            var str = "foo bar";
            var ofn = {
                "call" : function () {}
            };

            this.assertFalse(typeUtils.isHTMLElement(fnc));
            this.assertFalse(typeUtils.isHTMLElement(ary));
            this.assertFalse(typeUtils.isHTMLElement(obj));
            this.assertFalse(typeUtils.isHTMLElement(str));
            this.assertFalse(typeUtils.isHTMLElement(ofn));

            // Html elements
            this.assertTrue(typeUtils.isHTMLElement(Aria.$frameworkWindow));
            this.assertTrue(typeUtils.isHTMLElement(Aria.$frameworkWindow.document));
            this.assertTrue(typeUtils.isHTMLElement(Aria.$frameworkWindow.document.body));
            this.assertTrue(typeUtils.isHTMLElement(Aria.$frameworkWindow.document.body.firstChild));

            this.assertTrue(typeUtils.isHTMLElement(Aria.$window));
            this.assertTrue(typeUtils.isHTMLElement(Aria.$window.document));
            this.assertTrue(typeUtils.isHTMLElement(Aria.$window.document.body));
            this.assertTrue(typeUtils.isHTMLElement(Aria.$window.document.body.firstChild));

            // this.assertTrue(typeUtils.isHTMLElement(document.getElementsByTagName("*")));
        }
    }
});