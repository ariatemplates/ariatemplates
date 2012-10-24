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
 * Test cases for aria.utils.validators.AlphaNum
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.validators.AlphaNum",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.validators.AlphaNum"],
    $prototype : {
        /**
         * Test case 1: tests valid use cases.
         */
        test_isValid : function () {
            var useCases = ["123", "abc", "abc123"];
            var validator = new aria.utils.validators.AlphaNum();
            var test;
            for (var i = 0; i < useCases.length; i++) {
                test = validator.validate(useCases[i]); // if successful then null is returned.

                this.assertTrue(test == null, "testing:" + useCases[i] + ":");
            }
            validator.$dispose();
        },
        /**
         * Test case 2: tests invalid use cases.
         */
        test_invalid : function () {
            var useCases = [":123", ",abc", ".abc123"];
            var validator = new aria.utils.validators.AlphaNum();
            var test;
            for (var i = 0; i < useCases.length; i++) {
                test = validator.validate(useCases[i]); // if successful then null is returned.

                this.assertFalse(test == null, "testing:" + useCases[i] + ":");
            }
            validator.$dispose();
        }
    }
});
