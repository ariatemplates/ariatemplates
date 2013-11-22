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
 * Test case for aria.utils.Function
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Function",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Function"],
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
            var binded = aria.utils.Function.bind(myFunction, scope, 1, 2);

            // call it several time to be sure parameters are still ok
            binded(3, 4);
            binded(3, 4);

            this.assertTrue(executed);
        }
    }
});
