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
    $classpath : "test.aria.utils.validators.MinMaxLength",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.validators.MinMaxLength"],
    $prototype : {
        /**
         * Test case 1: tests valid use cases.
         */
        test_validate : function () {
            // "" and null are in the good use cases as a MinMaxLength validator is not a mandatory validator.
            var goodUseCases = ["12", "123", "1234", "", null];
            var badUseCases = ["1", "12345"];
            var validator = new aria.utils.validators.MinMaxLength(2, 4);
            var test;
            for (var i = 0, l = goodUseCases.length; i < l; i++) {
                var goodItem = goodUseCases[i];
                test = validator.validate(goodItem);
                this.assertTrue(test == null, "testing:" + goodItem + ":");
            }
            for (var j = 0, l = badUseCases.length; j < l; j++) {
                var badItem = badUseCases[j];
                test = validator.validate(badItem);
                this.assertFalse(test == null, "testing:" + badItem + ":");
            }
            this.assertTrue(test[0].errorMessage === "The value must be more than 2 and less than 4 characters long.");

            validator.$dispose();
        }
    }
});
