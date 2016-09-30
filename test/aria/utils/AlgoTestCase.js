/*
 * Copyright 2016 Amadeus s.a.s.
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
var ariaJsunitTestCase = require('ariatemplates/jsunit/TestCase');
var ariaUtilsAlgo = require('ariatemplates/utils/Algo');



module.exports = Aria.classDefinition({
    $classpath : 'test.aria.utils.AlgoTestCase',
    $extends : ariaJsunitTestCase,

    $prototype : {
        test_times : function () {
            // -----------------------------------------------------------------

            var times = ariaUtilsAlgo.times;

            // -----------------------------------------------------------------

            var self = this;

            var callback = function (index) {
                this.executed = true;
                return index;
            };

            var test = function (count, expectedResult) {
                var thisArg = {
                    executed: false
                };

                var result = times(count, callback, thisArg);

                if (count > 0) {
                    self.assertTrue(thisArg.executed, 'Function was not executed with the proper "this" value.');
                }
                self.assertJsonEquals(result, expectedResult);
            };

            // -----------------------------------------------------------------

            test(-1, []);
            test(0, []);
            test(1, [0]);
            test(5, [0, 1, 2, 3, 4]);
        }
    }
});
