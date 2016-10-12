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
var ariaUtilsFunction = require('ariatemplates/utils/Function');

/**
 * Test case for aria.utils.Function
 */
module.exports = Aria.classDefinition({
    $classpath : "test.aria.utils.FunctionTestCase",
    $extends : TestCase,
    $prototype : {

        /**
         * Test the bind method
         */
        test_bind : function () {

            var oSelf = this, executed = false, scope = {};

            // function to bind
            var myFunction = function (a, b, c, d, e) {

                // check arguments
                oSelf.assertTrue(a === 1);
                oSelf.assertTrue(b === 2);
                oSelf.assertTrue(c === 3);
                oSelf.assertTrue(d === 4);
                oSelf.assertTrue(!e);

                // check scope
                oSelf.assertTrue(this === scope);

                // validate execution
                executed = true;
            };

            // creates the binded function
            var binded = ariaUtilsFunction.bind(myFunction, scope, 1, 2);

            // call it several time to be sure parameters are still ok
            binded(3, 4);
            binded(3, 4);

            this.assertTrue(executed);
        },

        test_call : function () {
            // -----------------------------------------------------------------

            var call = ariaUtilsFunction.call;

            var expectedResult = {};
            var expectedSideEffect = {};

            var sideEffect = null;
            var callback = function () {
                sideEffect = expectedSideEffect;
                return expectedResult;
            };

            // -----------------------------------------------------------------

            var result = call(callback);

            this.assertTrue(sideEffect === expectedSideEffect, 'The function was not properly called');
            this.assertTrue(result === expectedResult, "The function's return value was not properly returned");
        }
    }
});
