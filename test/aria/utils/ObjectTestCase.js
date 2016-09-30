/* jshint -W075 : true */
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

var Aria = require('ariatemplates/Aria');
var TestCase = require('ariatemplates/jsunit/TestCase');

var ariaUtilsObject = require('ariatemplates/utils/Object');
var ariaUtilsJson = require('ariatemplates/utils/Json');



module.exports = Aria.classDefinition({
    $classpath : "test.aria.utils.ObjectTestCase",
    $extends : TestCase,
    $prototype : {
        /**
         * Test case on the aria.utils.Object.keys method
         */
        test_keys : function () {
            var objects = [null, undefined, {}, "abc", {
                        1 : "1"
                    }, {
                        1 : "1",
                        "1" : 1
                    }, {
                        1 : "1",
                        2 : "2"
                    }, {
                        1 : 2,
                        3 : 4
                    }, {
                        "abc" : 3,
                        "defg" : 4,
                        "hj" : 2
                    }, {
                        "fun" : function () {},
                        "null" : null
                    }, {
                        "nested" : {
                            "child" : "2"
                        }
                    }, ["a", "b", "c"]];

            // keys are always converted into strings
            var results = [[], [], [], [], ["1"], ["1"], ["1", "2"], ["1", "3"], ["abc", "defg", "hj"],
                    ["fun", "null"], ["nested"], []];

            var object = ariaUtilsObject;
            var json = ariaUtilsJson;

            for (var i = 0, len = objects.length; i < len; i += 1) {
                this.assertTrue(json.equals(object.keys(objects[i]), results[i]), "Array " + i
                        + " differs from expected");
            }

            // Use the prototype
            var Constr = function () {
                this.a = "b";
            };
            Constr.prototype.b = "c";

            var proto = new Constr();

            this.assertTrue(json.equals(object.keys(proto), ["a"]), "Proto object different from expected");
        },

        test_isEmpty : function () {
            var isEmpty = ariaUtilsObject.isEmpty;
            var obj = {};
            this.assertTrue(isEmpty(obj), "Empty object not recognized as such.");
            var str = "justAString";
            this.assertTrue(isEmpty(str), "String recognized as a non-empty object.");
            obj = {
                just : "anObject"
            };
            this.assertFalse(isEmpty(obj), "Non-empty object recognized as empty");
        },

        test_forOwnKeys : function () {
            // common ----------------------------------------------------------

            var forOwnKeys = ariaUtilsObject.forOwnKeys;

            var self = this;

            var callback = function (key, index, object) {
                self.assertTrue(this.object === object, 'thisArg is not properly set or 3rd parameter is not the given object');
                this.result.push(key);
            };

            var test = function(object, expectedResult) {
                var result = [];
                var thisArg = {
                    object: object,
                    result: result
                };

                var returned = forOwnKeys(object, callback, thisArg);

                result.sort();

                self.assertTrue(returned === object, 'Returned result should be the original object');
                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test({}, []);
            test({a: 'a'}, ['a']);
            test({a: 'a', b: 'b'}, ['a', 'b']);

            function base() {
                this.a = 'a';
            }
            base.prototype.base = 'base';
            test(new base(), ['a']);
        },

        test_assign : function () {
            // common ----------------------------------------------------------

            var assign = ariaUtilsObject.assign;

            var self = this;

            var test = function(destination, sources, expectedResult) {
                var result = assign.apply(null, [destination].concat(sources));

                self.assertTrue(result === destination, 'Returned result should be the destination object');
                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test({
                destinationOnly: 'destination',
                replaced: 'destination',
                sourceOnly: undefined
            }, [{
                replaced: 'source1',
                sourceOnly: 'source1',
                allSources: 'source1'
            }, {
                allSources: 'source2'
            }], {
                destinationOnly: 'destination',
                replaced: 'source1',
                sourceOnly: 'source1',
                allSources: 'source2'
            });
        },

        test_defaults : function () {
            // common ----------------------------------------------------------

            var defaults = ariaUtilsObject.defaults;

            var self = this;

            var test = function(destination, sources, expectedResult) {
                var result = defaults.apply(null, [destination].concat(sources));

                self.assertTrue(result === destination, 'Returned result should be the destination object');
                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test({
                destinationOnly: 'destination',
                alreadySpecified: 'destination',
                sourceOnly: undefined
            }, [{
                alreadySpecified: 'source1',
                sourceOnly: 'source1',
                allSources: 'source1'
            }, {
                allSources: 'source2',
                secondSourceOnly: 'source2'
            }], {
                destinationOnly: 'destination',
                alreadySpecified: 'destination',
                sourceOnly: 'source1',
                allSources: 'source1',
                secondSourceOnly: 'source2'
            });
        }
    }
});
