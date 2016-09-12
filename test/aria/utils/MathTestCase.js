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

Aria.classDefinition({
    $classpath : "test.aria.utils.MathTestCase",
    $dependencies : ["aria.utils.Math"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        /**
         * Test case on the aria.utils.Math.normalize method
         */
        test_normalize : function () {
            var value = 5;
            var min = 1;
            var max = 10;

            var normalizedValue = aria.utils.Math.normalize(value, min, max);
            this.assertTrue(value === normalizedValue);

            min = 6;

            normalizedValue = aria.utils.Math.normalize(value, min, max);
            this.assertTrue(min === normalizedValue);

            min = 1;
            max = 3;
            normalizedValue = aria.utils.Math.normalize(value, min, max);
            this.assertTrue(max === normalizedValue);
        },

        /**
         * Test case on the aria.utils.Math.min method
         */
        testMin : function () {
            this.assertTrue(aria.utils.Math.min(null, undefined) == null
            );
            this.assertTrue(aria.utils.Math.min(null, 1) == 1
            );
            this.assertTrue(aria.utils.Math.min(1, null) == 1
            );
            this.assertTrue(aria.utils.Math.min(1, 2) == 1
            );
            this.assertTrue(aria.utils.Math.min(2, 1) == 1
            );
        },

        /**
         * Test case on the aria.utils.Math.max method
         */
        testMax : function () {
            this.assertTrue(aria.utils.Math.max(null, undefined) == null
            );
            this.assertTrue(aria.utils.Math.max(null, 1) == 1
            );
            this.assertTrue(aria.utils.Math.max(1, null) == 1
            );
            this.assertTrue(aria.utils.Math.max(1, 2) == 2
            );
            this.assertTrue(aria.utils.Math.max(2, 1) == 2
            );
        }
    }
});
